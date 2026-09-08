package com.finx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FinxApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinxApplication.class, args);
    }
}
