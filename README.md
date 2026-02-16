Bosta Frontend Assessment – Fake Store
Overview

React-based e-commerce application built for the Bosta Frontend Engineer technical assessment.

The project demonstrates:

Clean component architecture

API integration

State management

Client-side data handling

Protected routes

Cart functionality

Responsive UI

Performance optimizations

Tech Stack

React (Vite)

React Router

TanStack React Query

Zustand (global state)

TailwindCSS

Axios

LocalStorage persistence

Features
Product Listing

Fetch from /products

Sorting (price asc/desc)

Filter by category

Pagination (10 per page)

Loading / error / empty states

Add to Cart

Product Details

Fetch by ID

Smart fallback:

Local products

Cached products

API

Add to Cart

Create Product (Protected)

Form validation

Categories from /products/categories

POST to /products

Local persistence (Fake Store API does not persist data)

Immediately reflected in listing

Cart (Protected)

Add / update / remove items

Total price calculation

Persisted in localStorage

Authentication

Login via /auth/login

Protected routes (Create & Cart)

Persisted auth state

Logout support

Performance Considerations

React Query caching & staleTime

Memoization with useMemo

React.memo for reusable components

Client-side pagination & sorting

Local merge strategy to avoid unnecessary refetch overrides

Image Handling

Accepts any image URL

CORS-safe configuration

Placeholder fallback for broken images

Run Locally
npm install
npm run dev

Demo Credentials
username: mor_2314
password: 83r5^_

Notes

Fake Store API does not persist created products.
Locally created products are stored and merged with API results to maintain a consistent UX.