---
title: SE-0117, API Design, and You
date: 2016-07-19
---

A lot of conversation has been going around about [SE-0117](https://github.com/apple/swift-evolution/blob/991e901f3ac9bb8d0d070b618a77bdb0aab00fd5/proposals/0117-non-public-subclassable-by-default.md) this week, as the proposal has entered its Active Review stage.

The tl;dr on this proposal is that all classes that are marked as `public` will not be able to be subclassed unless also marked `open`. Additionally, it’s functions, variables, and subscripts would also not be overridden unless explicitly marked as `open`. This means that classes will end up having behavior that some have dubbed "`final` by default" for any publicly available class. This behavior would eliminate the need for the compiler to generate dynamic dispatching for methods and properties since their implementation cannot be changed after compiletime. While the elimination of dynamic dispatch is a performance boost, this means extra care and attention will be required to turn dynamic dispatch back on for those who _want_ consumers to override the functionality of of their publicly exposed classes.

The changes here are quite interesting. People have taken to blogs and Twitter to express their opinions about how this will affect their development and workflow.

One argument against the proposal that I’ve often heard has been that been that this reduces, if not entirely eliminates, the dynamism of a language like Objective-C. There’s no getting around that elephant in the room; this is a major change.

However, I do think there are some resulting behaviors that have the power to push some core values forward in a way that will make Swift an even better language to work in.

## Lean on Protocols to Define the Behavior You Expect

APIs that expose functions that take in *protocols* rather than classes or subclasses will flourish. We don’t need to wrap up our intended behavior or properties into a `class` just to get the code we need run, but rather we can make the decision to use a struct or class, choosing value vs reference semantics.

This means that no matter what type we pass in, we’ll be able to get some property or call some function, regardless of what class, subclass, or subsubsubclass with its subsubclasses pass in.

This will lead to SDKs that don’t make you subclass `XYZModel` for their behavior and will allow you to create beautiful, testable, understandable, comprehensible code. The extraction of `MTLModel` in [Mantle](https://github.com/Mantle/Mantle) from a class to a protocol [in this PR](https://github.com/Mantle/Mantle/pull/219) is almost a case study in the benefits of this type of API design. By moving the behaviors of `MTLModel` off to protocol implementations, consumers of Mantle were no longer forced into making their types inherit from `MTLModel`, but let them choose their type that implemented the behavior. Craziest part of all? This conversation was happening in Objective-C-land, not Swiftopia.

Arguments against this proposal that circle around “subclassing lets me write code that I can test” are immediately moot if the API that they are trying to test takes in a protocol rather than a class.

For more about this, watch me wax poetic about [Mocks in Swift via Protocols](http://blog.eliperkins.me/mocks-in-swift-via-protocols).

## Encourage Composition over Inheritance

Clamping down on how classes’ behaviors can be modified or extended means that developers will need to find other ways to get the results they need.

Creating types that compose other types will be one opportunity Subclassers™ can use to create types that give the behavior they’re looking for. Packaging their `final class` into another type that executes the `final class`’s behavior and then returns its own behavior based on the results of that.

This will lead us towards a clearer business logic in types, that are more flexible and have less responsibilities. Gone will be the god/[Grob Gob Glob Grod](http://adventuretime.wikia.com/wiki/Grob_Gob_Glob_Grod) objects that have subclasses on subclasses just to get the behaviors they want. A series of classes that compose together can more clearly define intention and responsibility.

## Alternatives Considered

I would have loved to seen this implemented as an opt-in compiler-time flag, rather than a syntactical level keyword. As a language feature, some may want it, and benefit from it, while others may shy away or not understand it’s consequences. By having the compiler determine at compile time, with a flag such as `Disable subclassing on public classes`, we could still write the code we want, while being flexible enough to generate code and interfaces that we need.

While I may not be a ?? on the semantic implementation, I’m ?x? on the value that `final` by default would bring.
