---
title: Mocks in Swift via Protocols
date: 2015-10-01
---

Testing the nitty gritty dirty innards of a lot of iOS apps has been difficult in the past. A variety of tools and methodologies have been developed over time, including a couple mocking frameworks like [OCMock](http://ocmock.org/) or [OCMockito](https://github.com/jonreid/OCMockito). With the advent of Swift, these frameworks have seen their implementations rendered useless, since they depend heavily on the Objective-C runtime.

But with Swift, there might be a better way to setup our programs that don't require Objective-C ~~funtime~~runtime hacks and swizzles.

## Mocking `UIApplication`

Let's take a look at an example which mocks out our favorite hard-to-test class, `UIApplication`.

In our example, let's work on a type that handles push notifications.

```swift
struct PushNotificationController {
}
```

The goal of this type will be to have some function which we can call to ask the user for the permission to send push notifications, via `UIApplication`'s `registerUserNotificationSettings(_:)`, maybe handle some pushes and delegate calls for device tokens and such, etc.

We want to trigger push registration to be off of some state, say maybe once our user logs in, so that we don't bombard our new users with alerts without actually using our app first. A naïve approach might be to just create some function which calls `UIApplication.sharedApplication().registerUserNotificationSettings(_:)`.

```swift
struct PushNotificationController {
    var user: User {
        didSet {
            let application = UIApplication.sharedApplication()
            application.registerUserNotificationSettings(_:)
        }
    }
}
```

Easy, right? Okay, now let's go test this functionality so we know that we can write some unit test around `PushNotificationController` to know that we actually do register for push notifications when we give it a user.

```swift
import XCTest

class PushNotificationControllerTests: XCTestCase {
    func testControllerRegistersForPushesAfterSettingAUser() {
        let controller = PushNotificationController()
        controller.user = User()
        // uhhh... now what?
    }
}
```

![](http://i.imgur.com/yS9zFJK.gif)


## What's in a Test?

Let's take a step back here and figure out what has made our code untestable. There's a couple things that we're fighting against. We don't own `UIApplication` or it's `sharedApplication()` method, so it's a bit difficult to substitute our own functionality into these. Additionally, we don't have a way to know if calling `UIApplication.sharedApplication().registerUserNotificationSettings(_:)` really does anything in our unit test. We can't assert that the screen has the alert view on it now.

What are we _really_ trying to test here? We shouldn't be testing UIKit, there's a few Apple engineers out there whose job it is to do that. We really just want to test that our type asks the relevant party to register for push notifications, and in this case it _just so happens that_ the relevant party is a `UIApplication`.

## Protocol-Oriented Programming

So how can we get a bit of flexibility here? How can we verify our type?

**I propose that protocols are the best way to mock types in Swift.**

Let's create a protocol here to stand in for `UIApplication`.

```swift
protocol PushNotificationRegistrar {
    func registerUserNotificationSettings(_:)
}
```

Super simple. A `PushNotificationRegistrar` is any type that has a function `registerUserNotificationSettings(_:)` to call.

Next, let's dependency inject a `PushNotificationRegistrar` into our `PushNotificationController`.

```swift
struct PushNotificationController {
    let registrar: PushNotificationRegistrar
    init(registrar: PushNotificationRegistrar) {
        self.registrar = registrar
    }
}
```

Perfect. Now instead of calling `registerUserNotificationSettings(_:)` on `UIApplication.sharedApplication()`, let's instead call it on our `registrar`.

```swift
struct PushNotificationController {
    let registrar: PushNotificationRegistrar
    init(registrar: PushNotificationRegistrar) {
        self.registrar = registrar
    }

    var user: User {
        didSet {
            registrar.registerUserNotificationSettings(_:)
        }
    }
}
```

Beautiful! Now there's no more `UIApplication.sharedApplication()` to be seen! Less global state gives us a bit more wiggle room in our unit tests.

## Hooking up `UIApplication` with `PushNotificationRegistrar`

But if we don't have `UIApplication.sharedApplication()` ever, how do we get our application to register, you ask? This is where an amazing part of Swift's elegance comes into play.

We can conform any `UIApplication` type to `PushNotificationRegistrar` in one line of code:

```swift
extension UIApplication: PushNotificationRegistrar {}
```

Boom. Done. Since `UIApplication` already has a method named `registerUserNotificationSettings(_:)`, it's already implementing our protocol. In our application, we can simply just create a `PushNotificationController` in our application delegate, say in `application(_:didFinishLaunchingWithOptions:)`, like so:

```swift
extension AppDelegate: UIApplicationDelegate {
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject : AnyObject]?) -> Bool {
        let controller = PushNotificationController(application: application)
        controller.user = User()
    }
}
```

and just like that, we're on our way to registering!

## Testing with Mocks via Protocols

Now let's write a test around it. In this case, we don't want to give it a `UIApplication` because it's hard for us to get one and it's simply not testable, like we mentioned before. So instead, let's put together a quick type that does some faux registration for us.

```swift
import XCTest

class PushNotificationControllerTests: XCTestCase {
    func testControllerRegistersForPushesAfterSettingAUser() {
        class FauxRegistrar: PushNotificationRegistrar {
            var registered = false
            func registerUserNotificationSettings(notificationSettings: UIUserNotificationSettings) {
                registered = true
            }
        }

        let registrar = FauxRegistrar()
        var controller = PushNotificationController(registrar: registrar)
        controller.user = User()
        XCTAssertTrue(registrar.registered)
    }
}
```

Et volia! We just created a test that our application should register for push notifications after setting a user!

## What Would Crusty Do?

Creating mocks via protocols in Swift is great for reasons beyond just unit testing `UIApplication` methods. Protocols contribute greatly in creating [boundaries](https://www.destroyallsoftware.com/talks/boundaries) around pieces of your architecture and can make sure your make sure your software doesn't become too [crusty](https://developer.apple.com/videos/wwdc/2015/?id=408).

This isn't anything new to Swift, but rather certainly a pattern that is very trivial to implement in many places now. Protocol extensions with default implementations might even push this method forward more as Swift 2 develops more.

You can find a playground demoing some functionality of this here: https://gist.github.com/eliperkins/8f4115151497dc1953ea
