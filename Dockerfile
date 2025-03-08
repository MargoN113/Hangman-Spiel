# Используем официальный образ OpenJDK
FROM openjdk:17-jdk-slim as build

# Устанавливаем Maven
RUN apt-get update && apt-get install -y maven

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем все файлы из текущей директории в контейнер
COPY . . 

# Проверим, что файл 'pom.xml' присутствует
RUN ls -la /app

# Собираем проект с помощью Maven
RUN mvn clean package -DskipTests

# Запускаем Spring Boot приложение
ENTRYPOINT ["java", "-jar", "target/HangMan_SpringBoot-0.0.1-SNAPSHOT.jar"]

# Порт, который будет использоваться в контейнере
EXPOSE 8080
