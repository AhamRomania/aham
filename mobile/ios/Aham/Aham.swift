//
//  AhamApp.swift
//  Aham
//
//  Created by Cosmin Albulescu on 10.01.2025.
//

import SwiftUI
import SwiftData

@main
struct Aham: App {
    
    let authorized = true
    
    var body: some Scene {
        WindowGroup {
            if !authorized {
                Authorization()
            } else {
                Main()
            }
        }
    }
}
