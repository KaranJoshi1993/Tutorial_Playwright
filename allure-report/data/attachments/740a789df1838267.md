# Page snapshot

```yaml
- generic [ref=e2]:
  - article
  - generic [ref=e4]:
    - img "Logo" [ref=e6]
    - generic [ref=e7]:
      - heading "Sign In" [level=2] [ref=e8]
      - paragraph [ref=e9]: Access your account and stay connected.
    - generic [ref=e11]:
      - generic [ref=e14]:
        - img [ref=e16]
        - textbox "Email" [ref=e19]:
          - /placeholder: " "
          - text: admin@normanmax.com
        - generic [ref=e20]: Email
      - generic [ref=e23]:
        - img [ref=e25]
        - textbox "Password" [active] [ref=e29]:
          - /placeholder: " "
          - text: Nmis@3939
        - generic [ref=e30]: Password
        - img [ref=e32] [cursor=pointer]
      - generic [ref=e36]:
        - generic [ref=e41] [cursor=pointer]: Remember Me
        - link "Forgot Password?" [ref=e42] [cursor=pointer]:
          - /url: /forgot-password
      - button "Sign In" [ref=e44] [cursor=pointer]:
        - generic [ref=e45]: Sign In
```