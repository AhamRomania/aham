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
        
        let url = URL(string: "http://localhost:8080/v1/users/me")!
        
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImV4cCI6MTczNjY0MjYwNywic3ViIjoiYXV0aCJ9.5nS7ExfSe0IvvkCYo1hljRu5EZZanVbKuMQ10YVcdHA"
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue( "application/json", forHTTPHeaderField: "Content-Type")
        request.setValue( "Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        var ok = false
        
        let dg = DispatchGroup()
        
        dg.enter()
        
        let task = URLSession.shared.dataTask(with: request) { (data, resp, error) in

            if (error != nil) || (resp as! HTTPURLResponse).statusCode != 200 {
                dg.leave()
                return
            }
            
            dg.leave()
            
            ok = true
        }
        
        task.resume()
        
        dg.wait()
        
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
