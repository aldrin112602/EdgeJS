
# Laravel-like Templating for HTML in JavaScript

A lightweight JavaScript library that brings the power of **Laravel Blade-style syntax** (`@extends`, `@section`, `@yield`) to plain HTML files — no PHP required. Perfect for building modular frontend views with familiar templating structure.

## ✨ Features

* ✅ Supports `@extends('layouts.master')`, `@section('content')`, and `@yield('content')` or `@yield('title', 'Default Value')` and `@section('title', 'Login form')`
* ✅ Client-side HTML rendering without server-side compilation
* ✅ Simple, readable syntax for maintainable UI components
* ✅ Ideal for SPA or static site architectures

## 🔧 How It Works

This library fetches `.edge` files, parses them, and injects content sections into layout placeholders — all with JavaScript. No server-side logic needed.
