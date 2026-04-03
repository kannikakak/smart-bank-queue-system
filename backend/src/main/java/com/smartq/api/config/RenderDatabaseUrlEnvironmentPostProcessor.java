package com.smartq.api.config;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class RenderDatabaseUrlEnvironmentPostProcessor
    implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "renderDatabaseUrl";

    @Override
    public void postProcessEnvironment(
        ConfigurableEnvironment environment,
        SpringApplication application
    ) {
        String rawUrl = firstNonBlank(
            environment.getProperty("SPRING_DATASOURCE_URL"),
            environment.getProperty("DATABASE_URL")
        );

        if (rawUrl == null || rawUrl.startsWith("jdbc:")) {
            return;
        }

        if (!rawUrl.startsWith("postgresql://") && !rawUrl.startsWith("postgres://")) {
            return;
        }

        URI uri = URI.create(rawUrl);

        if (uri.getHost() == null || uri.getPath() == null || uri.getPath().isBlank()) {
            return;
        }

        Map<String, Object> overrides = new LinkedHashMap<>();
        overrides.put(
            "SPRING_DATASOURCE_URL",
            "jdbc:postgresql://" + uri.getHost() + ":" + resolvePort(uri) + uri.getPath()
        );

        String[] credentials = parseCredentials(uri);
        if (isBlank(environment.getProperty("SPRING_DATASOURCE_USERNAME")) && credentials[0] != null) {
            overrides.put("SPRING_DATASOURCE_USERNAME", credentials[0]);
        }
        if (isBlank(environment.getProperty("SPRING_DATASOURCE_PASSWORD")) && credentials[1] != null) {
            overrides.put("SPRING_DATASOURCE_PASSWORD", credentials[1]);
        }

        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, overrides));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private static int resolvePort(URI uri) {
        return uri.getPort() == -1 ? 5432 : uri.getPort();
    }

    private static String[] parseCredentials(URI uri) {
        String userInfo = uri.getUserInfo();
        if (isBlank(userInfo)) {
            return new String[] { null, null };
        }

        String[] split = userInfo.split(":", 2);
        String username = split.length > 0 && !split[0].isBlank() ? split[0] : null;
        String password = split.length > 1 && !split[1].isBlank() ? split[1] : null;

        return new String[] { username, password };
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value;
            }
        }
        return null;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
