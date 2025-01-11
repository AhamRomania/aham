//
//  AhamApp.swift
//  Aham
//
//  Created by Cosmin Albulescu on 10.01.2025.
//

import SwiftUI
import SwiftData

@main
struct Application: App {
    
    @UIApplicationDelegateAdaptor private var appDelegate: Delegate
    
    func authorized() -> Bool {
        let url = URL(string: "http://localhost:8080/users/me")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        var ok = false
        
        _ = URLSession.shared.dataTask(with: request) { (data, _, error) in
            if let error {
                print("Error: \(error)")
            } else {
                print("Error: \(String(describing: data))")
                ok = true
            }
        }
        
        return ok
    }
    
    var body: some Scene {
        WindowGroup {
            if !authorized() {
                Authorization()
            } else {
                Main()
            }
        }
    }
}
