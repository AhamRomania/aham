package com.aham

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class RoutingActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {

        enableEdgeToEdge()

        val splashScreen = installSplashScreen()

        super.onCreate(savedInstanceState)

        splashScreen.setKeepOnScreenCondition { true }

        startActivity(Intent(this, MainActivity::class.java).apply {
            // you can add values(if any) to pass to the next class or avoid using `.apply`
            putExtra("keyIdentifier", 1)
        })

        finish()
    }
}
