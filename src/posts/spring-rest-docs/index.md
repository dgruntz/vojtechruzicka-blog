---
title: 'Spring REST Docs - Test driven documentation of your REST API'
date: "2018-05-31T22:12:03.284Z"
tags: ['Spring', 'REST', 'Java']
path: '/spring-rest-docs'
featuredImage: './rest-docs.jpg'
disqusArticleIdentifier: '99005 http://vojtechruzicka.com/?p=99005'
excerpt: 'Test driven REST API documentation as an alternative to traditional Swagger docs.'
---

![Spring REST Docs](./rest-docs.jpg)

## SpringFox And Swagger
Traditional and popular approach to documenting your REST API is Swagger (aka OpenAPI), which I covered in detail in one of my previous articles.

<div class="linked-article"><h4 class="front-post-title" style="margin-bottom: 0.375rem;"><a href="/documenting-spring-boot-rest-api-swagger-springfox/" style="box-shadow: none;">Documenting Spring Boot REST API with Swagger and SpringFox</a></h4><small class="front-post-info"><span class="front-post-info-date">16 February, 2018</span><div class="post-tags"><ul><li><a href="/tags/rest/">#REST</a></li><li><a href="/tags/spring/">#Spring</a></li><li><a href="/tags/java/">#Java</a></li></ul></div></small><div><a class="front-post-image" href="/documenting-spring-boot-rest-api-swagger-springfox/"><div class=" gatsby-image-wrapper" style="position: relative; overflow: hidden;"><div style="width: 100%; padding-bottom: 66.6667%;"></div><img src="data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAANABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/9oADAMBAAIQAxAAAAFbFovBHEf/xAAbEAABBAMAAAAAAAAAAAAAAAABAAIDESEiMf/aAAgBAQABBQKMCpRTXdiKduiM/wD/xAAWEQEBAQAAAAAAAAAAAAAAAAABEBH/2gAIAQMBAT8BDZ//xAAWEQADAAAAAAAAAAAAAAAAAAABECH/2gAIAQIBAT8BMX//xAAZEAEAAwEBAAAAAAAAAAAAAAABAAIQIVH/2gAIAQEABj8CV6QQy1fImf/EABoQAAIDAQEAAAAAAAAAAAAAAAERACFBMXH/2gAIAQEAAT8hSm7vVG8Ct2B59hWRFlBclZUtMz//2gAMAwEAAgADAAAAEJz/AP/EABcRAAMBAAAAAAAAAAAAAAAAAAABESH/2gAIAQMBAT8Q0JEP/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARQf/aAAgBAgEBPxDIF7bf/8QAHBABAQACAgMAAAAAAAAAAAAAAREAQSGBUZHB/9oACAEBAAE/EB2QQJ2XWFqUCRH3JKQeOaYwkBLJSbOssFSQ6e84iiKXP//Z" alt="" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center; opacity: 0; transition-delay: 500ms;"><picture><img sizes="(max-width: 180px) 100vw, 180px" srcset="/linked/springfox/5e4a3/springfox.jpg 45w,
/linked/springfox/e451c/springfox.jpg 90w,
/linked/springfox/29fd0/springfox.jpg 180w,
/linked/springfox/b3ebb/springfox.jpg 270w,
/linked/springfox/8841e/springfox.jpg 360w,
/linked/springfox/95b54/springfox.jpg 540w,
/linked/springfox/2b1a3/springfox.jpg 900w" src="/linked/springfox/29fd0/springfox.jpg" alt="" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center; opacity: 1; transition: opacity 500ms ease 0s;"></picture><noscript><picture><img sizes="(max-width: 180px) 100vw, 180px" srcset="/linked/springfox/5e4a3/springfox.jpg 45w,
/linked/springfox/e451c/springfox.jpg 90w,
/linked/springfox/29fd0/springfox.jpg 180w,
/linked/springfox/b3ebb/springfox.jpg 270w,
/linked/springfox/8841e/springfox.jpg 360w,
/linked/springfox/95b54/springfox.jpg 540w,
/linked/springfox/2b1a3/springfox.jpg 900w" src="/linked/springfox/29fd0/springfox.jpg" alt="" style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture></noscript></div></a><span class="front-post-excerpt">How to document your Spring Boot REST APIs using Swagger with SpringFox?</span></div></div>

It is a powerful tool, which can be useful especially when you want to generate your docs for your existing API effortlessly. It detects all the endpoints, input and output parameters automatically and generates the docs. However, if you want to provide custom descriptions of all the endpoints and fields, you'll end up with polluting your code with many annotations. The vast majority of your Controller and Model classes' code is plagued with documentation-specific annotations, which makes them hard to read. In the example below, everything except the highlighted lines is REST API documentation specific.

```java{8-9,11-12}
@ApiOperation("Creates a new person.")
@ApiResponses(value = {
    @ApiResponse(code = 200, message = "Success", response = Person.class),
    @ApiResponse(code = 401, message = "Unauthorized"),
    @ApiResponse(code = 403, message = "Forbidden"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")})
@RequestMapping(method = RequestMethod.POST, produces = "application/json")    
public Person createPerson(
        @ApiParam("Person information for a new person to be created.")
        @RequestBody Person person) {
    return personService.createPerson(person);
}
```

## Spring REST Docs
Spring REST Docs take a different approach. Instead of infesting your controller and model classes with documentation annotations, it moves all this information elsewhere. To your tests. To be precise - to the tests of your Controllers. It is convenient because for many people tests are the best place to look at when trying to understand how some functionality works. Because unlike comments and documentation, tests are always up to date. When your tests are out of date and no longer in sync with your implementation, they start to fail.

This is important because if your documentation is outdated, people no longer trust it and it becomes useless. Having outdated documentation is worse than having no documentation at all. That brings us to what's so cool about Spring Rest Docs. It is tightly integrated with your tests. So when your documentation gets different from your implementation, your tests start to fail. For example, if you add a field, which is not documented, your test no longer passes. If you remove a field and it is still in your documentation, the test also fails.

## Spring Test MVC
For the behavior described above to work, Spring Rest Docs need to be integrated with your test framework, which you use to test your REST API. There are various options in Spring, but Rest Docs currently support Spring MVC Test, Spring Webflux's WebTestClient and RestAssured. In this tutorial, I'll cover Spring MVC Test, but you can use any of them.

## Setting Up Spring Rest docs

### Starting repository
To follow this tutorial, you can use any Spring/Spring Boot application with REST controllers. You can either use your own or build on top of a sample [starter repository](https://github.com/vojtechruz/rest-docs-starter) I prepared for this purpose.

The final source code for this tutorial is available in [this repository](https://github.com/vojtechruz/spring-rest-docs-example).

### Creating Spring MVC Tests
First, before diving deep into Spring Rest Docs specifics, you'll need some regular tests of your controllers. Let's create a simple one, which calls a controller's method and checks whether HTTP response code is 200 OK and the content type of the response is JSON. Of course, you can test much more, such as the response data, HTTP headers, cookies and so on.

```java
package com.vojtechruzicka.springrestdocs.controllers;

...

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PersonControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

     @Test
     public void getPersonByIdShouldReturnOk() throws Exception {
         this.mockMvc.perform(MockMvcRequestBuilders.get("/persons/1"))
                 .andExpect(status().isOk())
                 .andExpect(content().contentType("application/json;charset=UTF-8"));
     }

}
```

So far, nothing REST Docs specific, but this is the base we'll be building on.

### Adding the dependencies
The first thing you'll need to do is provide the Spring Rest Docs dependency. You'll need to use a different one depending on whether you want to use Spring MVC Test, WebTestClient or RestAssured. For Spring MVC Test use the following (the latest version).

```xml
<dependency> 
    <groupId>org.springframework.restdocs</groupId>
    <artifactId>spring-restdocs-mockmvc</artifactId>
    <version>2.0.1.RELEASE</version>
    <scope>test</scope>
</dependency>
```

Or for Gradle:

```
testCompile 'org.springframework.restdocs:spring-restdocs-mockmvc:2.0.1.RELEASE'
```

### Configuring your tests - Junit 4
Let's add a specific `@Rule` for REST documentation and then use it when building the mockMvc object. Only the highlighted lines below are new. The rest is the original code sample we already saw.

```java{10-12,18}
@RunWith(SpringRunner.class)
@SpringBootTest
public class PersonControllerJunit4Test {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Rule
    public JUnitRestDocumentation jUnitRestDocumentation 
    = new JUnitRestDocumentation();

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(documentationConfiguration(this.jUnitRestDocumentation))
                .build();
    }

    ...
}
```

### Configuring your tests - Junit 5
For JUnit 5, the configuration is also easy. You need to use `RestDocumentationExtension.class` extension in addition to Spring's one you would use normally. Then when constructing the mockMvc object apply the configuration. You're adding just the highlighted lines in the example below.

```java{2,9,12}
@SpringBootTest
@ExtendWith({ RestDocumentationExtension.class, SpringExtension.class})
public class PersonControllerJunit5Test {

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp(WebApplicationContext webApplicationContext,
                      RestDocumentationContextProvider restDocumentation) {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(documentationConfiguration(restDocumentation))
                .build();
    }

    ...
}
```

## Generating the Documentation
Now when we have the test configuration ready, it's time to write some documentation. First, let's provide a command to generate the documentation in each test method. Just add `andDo(document("[documentation snippet's name]"))`. Then you need to replace `MockMvcRequestBuilders` with   `RestDocumentationRequestBuilders`.

```java{4,8}
    @Test
    public void getPersonByIdShouldReturnOk() throws Exception {
        this.mockMvc.perform(
                RestDocumentationRequestBuilders
                .get("/persons/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andDo(document("persons/get-by-id"));
    }
```

Now let's run the tests to make sure everything works fine. They should pass and in your `target/generated-snippets` should be a sub-folder with a name matching the string you provided in `andDo(document("[documentation snippet's name]"))`. Inside, there should be a bunch of `.adoc` files.

![Generated Snippets](./generated-snippets.png)

If you don't want to provide snippet's name explicitly, you can provide placeholders, such as:

```java
andDo(document("{ClassName}/{methodName}")
```

### AsciiDoc vs. Markdown 
The files inside are fragments of your documentation. They contain information such as HTTP request and response or curl commands to call your endpoints.

The resulting API documentation should be, of course, HTML. However, as you can see, it is in a different format now. It's called AsciiDoc and it
is very similar to [MarkDown](https://www.markdownguide.org/getting-started). That means it's a simple markup language for text formatting written in plain text. MarkDown is widespread, well-known language, so why to introduce another one? Why not stick with MarkDown?

[Why You Shouldn’t Use Markdown for Documentation](http://ericholscher.com/blog/2016/mar/15/dont-use-markdown-for-technical-docs/#why-you-shouldn-t-use-markdown-for-documentation) sums the reasons pretty well. 

>Because the original Markdown is so limited, every popular tool built on top of Markdown implements what is called a [“flavor”](https://github.com/commonmark/CommonMark/wiki/Markdown-Flavors) of Markdown. This sounds great, except that every tool implements a different flavor. Even tools that do similar things with the language use different syntax for it!
...
In the last few years, [Commonmark](http://commonmark.org/) was developed as a standardized Markdown. This is great, and should solve lots of problems! Except that nobody has adopted it...

You can read more about the differences in [this comparison](https://asciidoctor.org/docs/asciidoc-vs-markdown/).

### Converting AsciiDoc
Since AsciiDoc cannot be directly rendered by a browser, we need a way to convert the documentation from AsciiDoc to HTML. There's a tool called AsciiDoctor, which is also [available as a Maven plugin](https://github.com/asciidoctor/asciidoctor-maven-plugin) ([there's also one for Gradle](https://asciidoctor.org/docs/asciidoctor-gradle-plugin/)). Just include the following in your `pom.xml` file.

```xml
<build>
    <plugins>
        <plugin> 
            <groupId>org.asciidoctor</groupId>
            <artifactId>asciidoctor-maven-plugin</artifactId>
            <version>1.5.5</version>
            <executions>
                <execution>
                    <id>generate-docs</id>
                    <phase>prepare-package</phase> 
                    <goals>
                        <goal>process-asciidoc</goal>
                    </goals>
                    <configuration>
                        <backend>html</backend>
                        <doctype>book</doctype>
                    </configuration>
                </execution>
            </executions>
            <dependencies>
                <dependency> 
                    <groupId>org.springframework.restdocs</groupId>
                    <artifactId>spring-restdocs-asciidoctor</artifactId>
                    <version>2.0.1.RELEASE</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

By default, this plugin does not run in any of the Maven lifecycle phases. So you need to bind it to one. Prepare-package is convenient if you want your generated documentation to be included in the resulting package and for example being served by Spring Boot as static resources.

### Putting the snippets together
Having `.adoc` snippets and AsciiDoctor Maven plugin is still not enough. You need to provide more AsciiDoc files, which will 'glue' together your generated snippets. In these files you can put any additional documentation and description needed by your users and you can choose which snippets to include and which not.

This is one of the advantages over the good old Swagger. It is not just documentation of your API endpoints, but you can include huge chunks of additional documentation or even whole pages. This means you can combine traditional documentation with API docs.

What you need to do is to create a directory `src/main/asciidoc` and create your new `.adoc` file there.

When you run `mvn package`, all `.adoc` files from `src/main/asciidoc` will be converted to HTML and copied to `target/generated-docs`. Lets create a file called `src/main/asciidoc/index.adoc`.

```asciidoc
= Sample API Documentation

== Introduction
This is an example of Spring REST Docs generated documentation.

== Persons API
Collection of CRUD API endpoints used to manipulate persons registered in the application.

=== Get Person By Id
Obtains a specific person registered in the application by its unique identifier.

==== Sample Request
include::{snippets}/persons/get-by-id/http-request.adoc[]

==== Sample Response
include::{snippets}/persons/get-by-id/http-response.adoc[]

==== CURL sample
include::{snippets}/persons/get-by-id/curl-request.adoc[]
```

As you can see, you can divide the document to any number of sections and provide any text you want. When you want to use previously generated snippets you use include statement like `include::{snippets}/persons/get-by-id/curl-request.adoc[]`. Now just run the maven build to make sure this AsciiDoc file is converted to HTML.

```commandline
mvn clean package
```

The resulting file should be available under `target/generated-docs/index.html` and it should look like this:

![Generated API Documentation](./generated-docs-1.png)

So far so good. Now let's tweak it a bit more. Let's add information about the author and version, the table of contents to be displayed on the left side and finally an automatic numbering of section headings. Just include the highlighted lines below the document heading.

```asciidoc{2-5}
= Sample API Documentation
Vojtech Ruzicka<myfakemail@gmail.com>
1.0.0, 30/5/2018
:toc: left
:sectnums:
```

![Generated API Documentation with Table Of Contents](./generated-docs-2.png)

To learn more about writing AsciiDoc, check the [user's manual](https://asciidoctor.org/docs/user-manual/).

## Documenting path params
We generated some documentation already, but so far it contains just a sample request and response and not much more. There's still much to be documented though.

Let's document the following endpoint more:

```java
    @RequestMapping(method = RequestMethod.GET, path = "/{id}", produces = "application/json")
    public Person getPersonById(@PathVariable int id) {
        return personService.getPersonById(id);
    }
```

Let's start with the PathVariable. That means that id of the person is passed in the URL as `/persons/{id}`.

```java{7}
@Test
public void getPersonByIdShouldReturnOk() throws Exception {
    this.mockMvc.perform(RestDocumentationRequestBuilders.get("/persons/{id}", 1))
        .andExpect(status().isOk())
        .andExpect(content().contentType("application/json;charset=UTF-8"))
        .andDo(document("persons/get-by-id",
               pathParameters(parameterWithName("id").
               description("Identifier of the person to be obtained."))));
}
```

When you run maven build again, your HTML document does not change. The reason is that you just generated a new snippet called `path-parameters.adoc`, however, you still need to include it in your `index.adoc` file. Let's add a new section then:

```asciidoc
==== Path Parameters
include::{snippets}/persons/get-by-id/path-parameters.adoc[]
```

If you build again, you should see a new section about path params in your documentation.

![Path Parameters Documentation](./path-parameters.png)

## Documenting request and response payload
Our controller's method `getPersonById()` returns a person represented as JSON. 

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "age": 42
}
```

Let's document all the fields using `responseFields()` method:

```java{9-15}
@Test
public void getPersonByIdShouldReturnOk() throws Exception {
    this.mockMvc.perform(RestDocumentationRequestBuilders.get("/persons/{id}", 1))
        .andExpect(status().isOk())
        .andExpect(content().contentType("application/json;charset=UTF-8"))
        .andDo(document("persons/get-by-id",
            pathParameters(parameterWithName("id")
                .description("Identifier of the person to be obtained.")),
            responseFields(
                fieldWithPath("id")
                    .description("Unique identifier of the person."),
                fieldWithPath("firstName")
                    .description("First Name of the person."),
                fieldWithPath("lastName")
                    .description("Last Name of the person."))
        ));
}
```

Now when you rerun the test, it fails horribly:

```java
org.springframework.restdocs.snippet.SnippetException: 
The following parts of the payload were not documented:
{
  "age" : 42
}
```

This is one of the most significant features of Spring Rest Docs in action. We forgot to include one of the response fields in the documentation, but the API still returns it. In other words, there is an undocumented field. If this happens, your tests start to fail, so your docs are always up to date. Moreover, it works the other way around too. If you document a field and your controller no longer returns it, your tests start to fail. It's really powerful.

If you add documentation also for the `age` field and build again, it generates yet another snippet - `response-fields.adoc`. You know the drill - include it in your docs and build again. And voila!

![Response Fields Documentation](./response-fields.png)

You can see Spring also inferred data type of the fields without us specifying it explicitly.

Documenting the request payload is pretty much same. Just use `requestFields()` method and `request-fields.adoc` fragment.

## Documenting request parameters
Request parameters can be passed in two ways. First, you can add them after question mark at the end of an URL:

```java
this.mockMvc.perform(RestDocumentationRequestBuilders
    .get("/persons?limit=100&order=asc"))
```

Or in a body of a POST request:

```java
this.mockMvc.perform(RestDocumentationRequestBuilders
    .post("/persons")
    .param("limit", "100")
    .param("order", "asc"))
```

Either way, documenting request params is the same:

```java
.andDo(document("persons/get-all", requestParameters(
    parameterWithName("limit")
        .description("Limit the number of persons obtained to this number."),
    parameterWithName("order")
        .description("Orders persons by name alphabetically in either ascending (asc) or descending (desc) order.")
)));
```

The resulting snippet is `request-parameters.adoc`.

## More documentation options
That's of course not all you can document. [There's more](https://docs.spring.io/spring-restdocs/docs/current/reference/html5/) - HTTP hearers, hypermedia links or multipart requests. However, the pattern is still the same. Include a method in your tests, run the tests, include the generated snippet in your AsciiDoc and finally run the maven build. 

## Spring Auto Rest Docs
There is an interesting alternative to vanilla Spring Rest Docs called [Spring Auto Rest Docs](https://github.com/ScaCap/spring-auto-restdocs). Its aim is to automate the process of documentation as much as possible. Instead of documenting all the JSON fields manually, it can generate the docs for them automatically by introspecting your classes, reading field names, types and the description from JavaDoc.

## Generating WireMock stubs from your API docs
Even more interesting is a project offering [Spring REST Docs WireMock Integration](https://github.com/ePages-de/restdocs-wiremock). It can generate [WireMock](http://wiremock.org/) stubs from your Spring Rest Docs API Documentation. This is really powerful as it ensures both your API documentation AND your API stubs are always up to date. Pretty cool, right? You can read more in [this blog post](https://developer.epages.com/blog/tech-stories/wiremock/).

## Conclusion
While Swagger and SpringFox are not a bad choice, Spring Rest Docs offers some powerful benefits you should definitely consider. The main one is having your docs always up to date, because if the documentation goes out of sync, the tests start to fail. Another one is that it motivates you to write tests of your controllers as they are required to create your API documentation.

Also, with Spring Rest Docs it is much easier to write documentation not only of your API directly, but also add any other necessary info such as tables, blocks of text, images, code blocks and so on. And of course, your production code is no longer plagued by all the documentation annotations, which make it so hard to read.

Swagger, on the other hand, offers a compelling option to call your API directly from the documentation. Also, it effortlessly generates basic information about your API without you writing anything. It can be useful for a legacy codebase to have at least some documentation in no time. Of course, without custom descriptions and explanations, but at least it is something.