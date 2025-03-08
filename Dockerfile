# Первый этап: сборка проекта
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем pom.xml и загружаем зависимости (для кэширования)
COPY pom.xml ./
RUN mvn dependency:go-offline

# Копируем исходники и собираем проект
COPY src ./src
RUN mvn clean package -DskipTests

# Второй этап: минимальный образ с Java для запуска
FROM openjdk:17-jdk-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем скомпилированный JAR из первого контейнера
COPY --from=build /app/target/HangMan_SpringBoot-0.0.1-SNAPSHOT.jar app.jar

# Открываем порт
EXPOSE 8080

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]


# Используем официальный образ OpenJDK
# FROM openjdk:17-jdk-slim as build
#
# Устанавливаем Maven
# RUN apt-get update && apt-get install -y maven
#
# Устанавливаем рабочую директорию
# WORKDIR /app
#
# # Копируем все файлы из текущей директории в контейнер
# COPY . .
#
# # Проверим, что файл 'pom.xml' присутствует
# RUN ls -la /app
#
# # Собираем проект с помощью Maven
# RUN mvn clean package -DskipTests
#
# # Запускаем Spring Boot приложение
# ENTRYPOINT ["java", "-jar", "target/HangMan_SpringBoot-0.0.1-SNAPSHOT.jar"]
#
# # Порт, который будет использоваться в контейнере
# EXPOSE 8080
