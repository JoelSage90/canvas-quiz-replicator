## – week 2: web frameworks

#### Model-View-Controller

- model - represent’s knowledge
    - basically like a database
    - contains and manages data for application
- view - displays a subset of data to user in a certain way
    - This is basically the user UI
    - can have multiples views for same data
- Controller - handles data between model and view
    - handles data processing but is independing of both
    - takes in user inputs and manipulates model using this
    - determines view for a certain response
- editor - basically like a special kind of controller
    - used between view and controller
    - lets user make changes to viewer
    - created and deleted on use

![image.png](attachment:076a92d4-25ba-449c-af04-91030d02b254:image.png)

![image.png](attachment:d4f69695-482a-4812-baeb-159cf1bc21e6:image.png)

#### [original MVC specification](https://canvas.manchester.ac.uk/courses/40397/files/15266430/download?download_frd=1) - reading

## – week 3: data modelling

#### Role of model in MVC

- represents app data and business logic (methods to operatte on data)
- need model for controller and view to have something
- persistence - save data so can be reused later

#### domain model using POJO

- data modelled as Plain Old Java object
    - has id + attributes - all private
    - access using getter and setters
- spring does this automatically

#### JPA annotations in model

- @Enitity - mark the class as a table
- @Table - optional for table name
- @Id - which field is primary key
- @GeneratedValue - autot generates ids

#### entitiy relationships

- one-to -many
- many-to-one
- one-to-one

#### spring layered aritecture

- dont have crontroller directly to DB
- better layers
    - respository - handles database access
    - service - contains logic to manupulate data (process before controller)
    - controller - only handles requests/reponses

![image.png](attachment:9968a222-8c94-409b-94a4-972a909cb5ac:image.png)

#### Spring Data Repository

- spring provides CRUD stuff
    - create, read, update, delete
- only define interface - so it generates things like (`findAll(), findById(),save(),etc`)

#### derived query methods

- spring can generates queries from method names
    - based on things like find, orderby,etc

#### service layer

- enforces separations of concerns + handles business logic
- controls waht controller can see
- autowired - injects dependencies

## – week 4: designing UI

#### "[The Eight Golden Rules of Interface Design](https://www.cs.umd.edu/users/ben/goldenrules.html)” - reading

- strive for consistency - consistent UI for things like buttons,menus,etc
- seek usability - needs to work for range of users and devices
- informative feedback - response should be given to help guide user
- yeild closure - actions should have start middle and end
    - and some indication of action is complete
- prevent errors - user shouldn’t cause errors
    - if they do, give feedback - state should be left unchanged
- easy reversal - remove anxious feeling from users
- keep users in control - no unexpected things should happen or hard to get info
- reduce short term mem load - avoid making users needing to remeber alot

#### [Dark Patterns: Past, Present, and Future](https://canvas.manchester.ac.uk/courses/40397/files/15295685/download?download_frd=1) - reading

- dark patterns: tricking user into doing something they might not want to
- cognitive tricks + deception
- developers should follow ethical coding practices.
    - users need to know to spot dark patterns

## – week 5: specification by example

#### what is specification by example + why

- requirements are defined by concrete examples not just vague descriptions
- bridge gap between requirements and interpretation
- basically goal is to have a good shared understanding

#### Interpret example-based specifications

- behaviour is described thorugh examples that have: input, action and expected output
    - give when then

#### Test cases from examples

- can directly make tests from these examples
- create tests for all the examples given and derive some
    - eg: above and below the thresholds they give and edge cases

#### edge cases

- scenarios at boundary/extremes of valid input
- this is where lots of bugs occur so good to catch it
- helps ensure validtion works, unexpected bheavior avoided and system is robust

#### validation implemented in Spring + controller behaviour when validation fails

- uses `@Valid` annotation on the entities/attributes
- along with other validation contraints to apply
    
    ```haskell
    @NotNull
    @NotBlank
    @Size(min = 8)
    @Email
    @Min(18)
    ```
    
- controller
    - RequestBody - takes http request and makes it java object
    - valid - triggers validation for RequestBody
    - bindingResult - spring object that holds result of validation
    
    ![image.png](attachment:e5363ea6-aedc-4796-a990-3dd73ecfe729:image.png)
    

#### Specification by Example as living documentation

- describes software behaviour and can be updated alongside code
- easy to test
- living documentation: evolves with system, remains accurate, executable thru tests

## – week 6: testing functionality in isolation

#### [An_Empirical_Study_of_Flaky_Tests_in_Python](https://canvas.manchester.ac.uk/courses/40397/files/15295699/download?download_frd=1) reading

- flaky test - sometimes pass but sometimes fails without any code changes
    - wastes dev time, hides real bugs, reduces trust in testing
- causes
    - order dependency - test depend on execution order (58%)
        - A changes state causing B to fail if A happens first
    - test infrastructure issue - problem outside code (28%)
        - eg: missing files
    - other causes (13%)
        - network use + randomness
        - non-order depending - eg: timing issue, resource, etc
- could do reruns to increase confidence
    - 95% confidence is about 170 runs
    - not perfect and can waste resources

#### Software testing

- assess software quality and functionality
- validation: have we built the right software
- verification: have we built the software right

#### defects vs failures

- defect: when a function/feature is not implemented or implemented incorrectly
- failure: result of defect. this is when we have an issue caused by defect

#### exhaustive testing is impossible

- too many cases to test for a single input - could be infinite
    - cant test every single case
- instead pick specific cases - good, bad, edge, etc

#### test methods + levels

- test methods
    - static - don't run the actual code
    - dynamic - run the code and test it
    - black box - test without knowing internal structure
    - white box - make tests which specifically are based on internal structure
- levels
    - unit - one block of code works is isolation
    - integration - larger blocks of code works correct
    - system - end 2 end tests
    - acceptance - user perspective
    - regression - capture bugs and defects

#### pros and cons + isolation of unit

- pros
    - can test specific parts
    - ensures that we know that individual part work on its own
- cons
    - cant test how they interact with each other
        - for this we need something like integration instead

#### test doubles

- dummy - passed around but never used
- fake - generally works but has some shortcuts - unsuitable for full production
- stubs - a canned answer to particular invocation
    - eg: we have a function readTemperature() which returns a temp
        - we want to test when its 0 so we say in our test that this returns 0
- mock - pre-programmed expectations of how it will be called
    - mock what will happen internally when called

#### mocking in spring

- in tests we can set certain things to mock - use `@mock`
- in the test we do
    - when(something).then<do something else>
    - can chain together like stream
- verification
    - after our test we can then verify if what we expect happens for the mocked part
    - eg: exactly once - `verify(venueService,times(1)).delete(1L)`
        - can also have atMost(n), never()

## – week 7: providing REST API

#### [Representational State Transfer (REST)](https://canvas.manchester.ac.uk/courses/40397/files/15295711/download?download_frd=1) - reading (chapter 5)

- concepts
    - resource - anything thta can be named
    - rep - data sent between client and server - represents state of resource
    - connectors - eg: resolver + tunnel
    - client - initalizes request
    - cache - store response
    - server - response
    - components - user agent, origin server, gateway/proxy
- REST defines set of contrains that shape how components interact
    - built by incrementally adding contraints to system
- client server - seperate user interface from data storage
- server has no session state, request has everything - stateless
- caching - response marked as cachable or not
- improves performance but could have stale data
- uniform interface - standarised way to interact with resource
- layered structure - rest is structured in layer - more latency but secure

#### what is rest + how used in Spring

- resource state transfer
    - everything is resource
- architecutre principal of www
- in spring, most of REST can be handled in crud repository and entities
    
    ```haskell
    @RestController
    @RequestMapping("/users")
    public class UserController {
        @GetMapping("/{id}")
        public User getUser(@PathVariable int id) {
            return userService.findById(id);
        }
        @PostMapping
        public User createUser(@RequestBody User user) {
            return userService.save(user);
        }
    }
    ```
    

#### client server interaction in rest + why stateless

- stateless - server has no awareness of state for client
    - all info is in request and all info needed is sent
- client and server agree on a medium of communication
- why
    - scalable, simple, reliable

#### rest x web

- used alot of web through http verbs

#### resources + URIs

- resource is something which we are transfering or exchanging
    - anything that can be named and api exposes
- URI - unique id for a resource

#### use for HTTP verbs

- these will map to specifc CRUD operations
- GET, POST, DELETE, etc

#### idempotence

- running a certain https verb has the same effect regardless of how many times its been ran
- eg: GET can be ran multiple times and output the same thing

#### representations and content negotations

- this is what is sent between client and server
- representations is how the client and server agree on communcation and transfer resource
- eg: json
- content negotiations - client tells server in header

#### HATEOAS

- hypermedia as the engine of application state
- response should include links to related actions/resources
    - so client can explore api dynamically

#### caching

- representations can specify how long a resource last for - so can cache this to use for freqenty use
    - this is good for internet (eg: social media feed getting new post - just cache the newest x posts)

## – week 8: using external API

#### Why external API and criteria

- implement features made by others rather than developing ourselves
- criteria:
    - good documentation, good support, easy of use, limits

#### API usage - search + intergration problem

- we need to pick the api based on what we need and how we can use it
- needs to fit into our system

#### external APIs in MVC

- api needs to be in correct place in MVC
- for example, for geocoding, the model interacts with the api
    - since here we want the api data stored in model

#### geocoding

- converting address into coords
- need this for mapping to place on map

#### API integration to Spring entities

- mode entities are extended to have new attributes
    - using getters and setters to access
    - call api after address is stored

#### programming by example

- can use the examples given in the documenttion to help us (or from stack overflow)
    - copy-paste blindly ❌
    - understand and adapt ✅

#### testing when using APIs + risk + constraints

- test parts of mvc which interatc with api and test it works
- risks
    - API may fail, network costs, bad docs
- constraints
    - api quotes, costs

## - week 9: Integrating external services

#### Understand External Service Integration

- intergrade external services to system through APIs
    - communicates with service over network to retrieve and send data

#### Purpose of APIs in Software Engineering

- API (application programming interface) - allows software to communicate with each other
- prevents devs from reinventing the wheel
    - pick correctly depending on what we need

#### Federated Social Networks

- each federated social network can be its own topic focus
- can connect federated networkds together - activitypub
    - this defines how they exchange info
- timelines in masterdone: home, local, federated

#### MVC Integration with External APIs

- for mastodoon, its better to have this connected to the controller
    - rather than communicating with mastodon directly from controller, a separate service is made for mastodon
    
    ![image.png](attachment:bdaccc2d-e100-4f5c-853c-b7fa41356901:image.png)
    

#### Mastodon

- MaodonClient - represents connection between spring application and mastodon server
- Timelines - retrieving social media feeds
    - eg: getHome() in timelines class returns List<Status>
- Statuses - for publishing posts
    - postStatus()
- Status - representing an individual post internally
    - each status has: id,content, url, datatime,language,etc
- mastodon service can implement
    - register, publish(s), read() ← implement these using api calls
    - then use these in the mvc