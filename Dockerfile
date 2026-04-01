# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy pom first — lets Docker cache the dependency layer
COPY pom.xml .

# Download dependencies (cached unless pom.xml changes)
RUN apk add --no-cache maven && \
    mvn dependency:go-offline -B

# Copy source and build the fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy only the fat JAR from the build stage — keeps image small
COPY --from=builder /app/target/BankingApplication-0.0.1-SNAPSHOT.jar app.jar

# Render / cloud platforms inject PORT at runtime
EXPOSE 8082

# JVM flags: reduce memory footprint for free-tier containers
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
