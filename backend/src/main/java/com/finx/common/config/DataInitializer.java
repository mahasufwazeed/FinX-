package com.finx.common.config;

import com.finx.common.enums.Role;
import com.finx.common.enums.UserStatus;
import com.finx.user.entity.User;
import com.finx.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initializes default system data such as the administrative account on application startup.
 */
@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepository.existsByRole(Role.ADMIN)) {
            User admin = new User(
                    "FINX System Administrator",
                    "admin@finx.com",
                    passwordEncoder.encode("Admin@Finx2026!"),
                    Role.ADMIN,
                    UserStatus.ACTIVE
            );
            userRepository.save(admin);
            log.info("Default system administrator initialized: admin@finx.com");
        }
    }
}
