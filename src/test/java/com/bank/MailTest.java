package com.bank;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

// Sends a REAL email to verify Gmail SMTP is correctly configured.
// Run with: mvn test -Dtest=MailTest -pl . (from project root)
@SpringBootTest
public class MailTest {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Test
    void sendTestEmail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(fromEmail);                              // sends to itself as a sanity check
        msg.setSubject("✅ VaultXchange SMTP Test — It Works!");
        msg.setText(
            "Hello from VaultXchange!\n\n" +
            "This is a test email confirming that Gmail SMTP is correctly\n" +
            "configured and low-balance alert emails will be delivered.\n\n" +
            "  Sender : " + fromEmail + "\n" +
            "  Host   : smtp.gmail.com:587\n" +
            "  Auth   : App Password (STARTTLS)\n\n" +
            "✅ If you received this, everything is working perfectly.\n\n" +
            "— VaultXchange Team"
        );

        mailSender.send(msg);
        System.out.println("✅ Test email sent successfully to: " + fromEmail);
    }
}
