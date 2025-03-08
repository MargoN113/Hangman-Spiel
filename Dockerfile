# Используем официальный образ OpenJDK
FROM openjdk:17-jdk-slim as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем все файлы в контейнер
COPY . .

# Собираем проект с помощью Maven
RUN ./mvnw clean package -DskipTests

# Запускаем Spring Boot приложение
ENTRYPOINT ["java", "-jar", "target/HangMan_SpringBoot-0.0.1-SNAPSHOT.jar"]

# Порт, который будет использоваться в контейнере
EXPOSE 8080
