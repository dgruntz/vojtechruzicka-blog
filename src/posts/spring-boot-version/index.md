---
title: 'Detecting build version at runtime in Spring Boot'
date: "2018-06-23T22:12:03.284Z"
tags: ['Spring']
path: '/spring-boot-version'
featuredImage: './spring-boot-version.jpg'
disqusArticleIdentifier: '99007 http://vojtechruzicka.com/?p=99007'
excerpt: 'How to obtain artifact version and other build information in a Spring Boot app at runtime?'
---

# Obtaining build information
It can be often useful to obtain information about artifact, version, build time and other at runtime. Sure, most of this information is already in your `pom.xml` file, but it can be tricky to obtain these when the application is running.

Having such information at runtime can be useful. For example, imagine scenario, where you expose a REST endpoint, which can tell the clients what is your current version of the aplication, when was it built and so on. It can be useful because you can easily determine what version of the app is currently deployed. This can be especially useful on non-production environments, where the app is frequently deployed or even with continuous deployment in production. In such cases, it is vital to know what build exactly is currently running when testing and submitting bug reports. Maybe the issue reported is already fixed in a newer version or maybe the bug still occures because the new version is implemented but not deployed yet.

In any case, having build information can be handy and it is useful to know how to obtain it at runtime. In Spring Boot, it is fortunately quite easy.

## Build plugin configuration
If you are using Spring Boot, your `pom.xml` should already contain [spring-boot-maven-plugin](https://docs.spring.io/spring-boot/docs/2.0.3.RELEASE/maven-plugin/). You just need to add the following configuration.

```xml{4-11}
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <id>build-info</id>
            <goals>
                <goal>build-info</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

It instructs the plugin to execute also [build-info](https://docs.spring.io/spring-boot/docs/2.0.3.RELEASE/maven-plugin/build-info-mojo.html) goal, which is not run by default. This generates build meta-data about your application, which includes artifact version, build time and more. 

If you are using Gradle, just add the following to your `build.gradle` file:

```json
springBoot {
    buildInfo()
}
```

## Accessing Build Properties
After configuring your `spring-boot-maven-plugin` and building your application, you can access anformation about your application's build through `BuildProperties` object. Let the spring inject it for you:

```java
@Autowired
BuildProperties buildProperties;
```

Now you can access various information from this object.

```java
// Artifact's name from the pom.xml file
buildProperties.getName();
// Artifact version
buildProperties.getVersion();
// Date and Time of the build
buildProperties.getTime();
// Artifact ID from the pom file
buildProperties.getArtifact();
// Group ID from the pom file
buildProperties.getGroup();
```
# Adding custom properties
# How it works under the hood
When `build-info` of `spring-boot-maven-plugin` is run, it generates a property file containing all the build information. By default, it is located at `${project.build.outputDirectory}/META-INF/build-info.properties`, but you can customize it by providing `outputFile` parameter. The file looks something like this:

```properties
#Properties
#Sat Jun 23 15:58:56 CEST 2018
build.version=0.0.1-SNAPSHOT
build.group=com.vojtechruzicka
build.name=spring-rest-docs-example
build.artifact=spring-rest-docs-example
build.time=2018-06-23T13\:58\:56.742472800Z
```

# Detecting Spring profiles
It is no doubt useful to know which version of your artifact is deployed and when it was built. However, it is usually not enough. Often Spring applications use various profiles, which can significantly change the way they behave. Common usage is, for example, having a separate profile for each environment (DEV, UAT, PROD, ...) . Depending on the profile correct environmental configuration can be loaded such as DB connection and more.

It is useful to be able to determine current profiles as sometimes the app can be run with different profiles than expected. To detect the current profiles, you need just to inject `Environment` object and then you can simply obtain them by calling environment.

```java
@Autowired
private Environment environment;

environment.getActiveProfiles();
```

What's more, since you already have environment object, you can obtain any environmental properties by calling `environment.getProperty("property.name")`.

# Spring Actuator


# Conclusion
Having access to version and build information at runtime can be quite useful. In Spring boot application, you can easily obtain the info by altering the Spring Boot MAven/Gradle plugin configuration to generate the `build.properties` file and then accessing it through `BuildProperties` object.

For simple scenarios it is easy and quick solution and should work for you, if you need something more powerful, look at Spring Actuator or Spring Admin, which can provide the build metadata functionality plus a lot extra on top.