# User module boundary

Account creation and recovery are currently owned by `modules/auth`; the executable User schema is in `shared/database/models/User.mjs`. There are no standalone user-management or team-role APIs yet. Add those deliberately here instead of duplicating account/auth logic.
