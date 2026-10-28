package com.rentease;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:rentease-test;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false",
    "rentease.jwt.secret=0123456789abcdef0123456789abcdef",
    "rentease.cors.allowed-origins=http://localhost:5173"
})
@AutoConfigureMockMvc
class RentEaseApplicationTest {
    @Autowired MockMvc mvc;

    @Test
    void applicationContextStartsWithJpaMappingsAndSecurityConfigured() {}

    @Test
    void propertySearchIsPublic() throws Exception {
        mvc.perform(get("/api/properties")).andExpect(status().isOk());
    }

    @Test
    void adminRouteRejectsAnonymousRequests() throws Exception {
        mvc.perform(get("/api/admin/dashboard")).andExpect(status().isUnauthorized());
    }

    @Test
    void studentRoleCannotAccessAdminRoute() throws Exception {
        mvc.perform(get("/api/admin/dashboard").with(user("student").roles("STUDENT")))
            .andExpect(status().isForbidden());
    }
}
