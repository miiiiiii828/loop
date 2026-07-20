import Cocoa
import Foundation

// LOOP macOS activity collector — local-first hackathon alpha.
// Run: swift loop-agent.swift
// Grant Accessibility permission when macOS asks.

struct Activity: Codable {
    let timestamp: Date
    let application: String
    let window: String
}

let store = FileManager.default.homeDirectoryForCurrentUser
    .appendingPathComponent("Library/Application Support/LOOP/activity.jsonl")
try? FileManager.default.createDirectory(at: store.deletingLastPathComponent(), withIntermediateDirectories: true)

func frontmost() -> Activity? {
    guard let app = NSWorkspace.shared.frontmostApplication else { return nil }
    let name = app.localizedName ?? "Unknown"
    let safeName = name.replacingOccurrences(of: "\"", with: "\\\"")
    let script = """
    tell application "System Events"
      tell process "\(safeName)"
        try
          return name of front window
        on error
          return ""
        end try
      end tell
    end tell
    """
    var error: NSDictionary?
    let title = NSAppleScript(source: script)?.executeAndReturnError(&error).stringValue ?? ""
    return Activity(timestamp: Date(), application: name, window: title)
}

print("LOOP is watching locally. Press Control-C to stop.")
var last = ""
while true {
    if let item = frontmost() {
        let signature = item.application + "|" + item.window
        if signature != last, let data = try? JSONEncoder().encode(item) {
            if !FileManager.default.fileExists(atPath: store.path) { FileManager.default.createFile(atPath: store.path, contents: nil) }
            if let file = try? FileHandle(forWritingTo: store) {
                try? file.seekToEnd()
                try? file.write(contentsOf: data + Data([0x0A]))
                try? file.close()
            }
            print("• (item.application) — (item.window)")
            last = signature
        }
    }
    Thread.sleep(forTimeInterval: 5)
}
