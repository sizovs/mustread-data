[![Build Status](https://travis-ci.org/sizovs/mustread-data.svg?branch=master)](https://travis-ci.org/sizovs/mustread-data)

# Contribution guidelines

Let's build the best technical book listing together! ❤️ 

## What books are (not) welcome

✅ Timeless, fundamentals books (e.g. Clean Code)

✅ Books with Goodreads rating > `3.8`

❌ Books on narrowly focused technology (Java Persistence with MyBatis, A Beginner's Guide to the Meteor Framework...)

❌ Great, but unrelated books (e.g. Atlas Shrugged, Sapiens)

## How to contribute a book

1) Copy the following book template:

```
---
book:  
  # 13-digit ISBN of a book
  isbn: '1234567891234'
  
  # Book tags. Two is maximum, one is better.
  # To avoid tag chaos, please:
  # 1) Use existing tags or raise an issue if the needed tag is missing.
  # 2) Don't use coding, testing and other general tags with platform/language specific books.
  tags:
    - management

  # (optional) Your Twitter handle
  kudo: eduardsi

  # (optional) Book description that will override the automatically fetched description
  about: |
    Alex Rogo is a harried plant manager working ever more desperately to try and improve performance. 
    ... 
```

2) [Create a new file under `/books/<Book Title.yml>`](https://github.com/sizovs/mustread-data/new/master/books?filename=Book%20Title.yml&value=%23%20Paste%20the%20book%20template%20here&description=Adding%20%20Book%20Title.%20I%20think%20it%27s%20a%20must-read%20because...&message=Added%20Book%20Title)
3) Paste the book template
4) Populate the book template with correct data
5) Commit, push 🚀

## FAQ
### How do I find ISBN?
1) Visit [Goodreads](https://goodreads.com)
2) Find the book by name or book's author
3) See book's ISBN13

## The best books for developers
- [Agile](https://mustread.tech/books/about/agile)
- [Coding and Programming](https://mustread.tech/books/about/coding)
- [Communication](https://mustread.tech/books/about/communication)
- [General Software Development](https://mustread.tech/books/about/general)
- [Java](https://mustread.tech/books/about/java)
- [JavaScript](https://mustread.tech/books/about/javascript)
- [Leadership and Management](https://mustread.tech/books/about/management)
- [Operating Systems](https://mustread.tech/books/about/operating~systems)
- [Product Development](https://mustread.tech/books/about/product~development)
- [Ruby](https://mustread.tech/books/about/ruby)
- [Software Architecture](https://mustread.tech/books/about/architecture)
- [Testing and Quality Assurance](https://mustread.tech/books/about/testing)
- [Thinking](https://mustread.tech/books/about/thinking)
- [Web Technologies](https://mustread.tech/books/about/web)
