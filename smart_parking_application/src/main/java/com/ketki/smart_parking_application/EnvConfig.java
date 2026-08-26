package com.ketki.smart_parking_application;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    public EnvConfig() {
        Dotenv dotenv = Dotenv.load();

        System.out.println("DB_USERNAME=" + dotenv.get("DB_USERNAME"));
        System.out.println("DB_PASSWORD=" + dotenv.get("DB_PASSWORD"));
        System.out.println("JWT_SECRET=" + dotenv.get("JWT_SECRET"));

        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
    }
}