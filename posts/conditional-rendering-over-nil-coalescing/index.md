---
title: Conditional Rendering Over Nil Coalescing
date: 2026-05-18
excerpt: Stop using empty strings, empty arrays and zeros as fallbacks for your nullable values.
---

Stop writing `count ?? 0`{swift} in your UI code.

Stop writing `items ?? []`{swift} in your API return values.

Please, _for the love of god_, stop writing `item?.id ?? ""`{swift}, especially. Coalescing feels satisfying when you appease the compiler or typechecker, but what you're doing is introducing a ticking timebomb instead.

I've been guilty of using each of these patterns over my career. What I should have done instead was understand _why_ those values could be nil and handle them with some loud error or better yet, some UI that indicated these values were missing or loading or just plain empty still.

I see _so much_ UI code that defaults to these fallback values, rather than conditionally rendering a loading indicator, an error message or an empty state.

So this is my plea: **stop using nil coalescing in your UI code**. Use conditional rendering and show a dang loading indicator, error message, or empty state instead. It will make your product _so much better_. Your users will thank you. The various loading and empty states will be obvious and your app will feel that much more polished.

Future You™ will be so stoked when your API starts returning `nil`{swift} values for some edge case Current You™ hadn't considered. Future You™ will be so appreciative when they see an error rendered instead of an empty label because Current You™ thought `?? ""`{swift} was a quick way to get the feature out.

A quick `if let items { ListView(items: items) } else { LoadingIndicator() }`{swift} will be so great for your users to understand what's up.

A simple `switch result { case .success(let value): ... case .failure(let error): ... }`{swift} will impress your teammates with your careful consideration of the error case.

A brief `if !items.isEmpty { ListView(items: items) } else { ContentUnavailableView() }`{swift} will look impressive for those brand new users to your app.

A thoughtful `if let itemID = selectedItem?.id { ... }`{swift} will save you hours of debugging why your database is filled with missing IDs or why your API is erroring out.

Just handle the dang `nil`{swift} values. Please.
