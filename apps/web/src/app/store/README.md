# State ownership

There is no additional global-store library. Authentication/workspace state lives in `app/providers/AuthProvider.jsx`, product shell state in `ProductProvider.jsx`, and form/filter drafts in their owning features. Add a store only for shared state that cannot reasonably stay with those owners; never persist passwords or tokens in browser storage.
