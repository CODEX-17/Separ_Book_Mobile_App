# TODO

- [x] Import `feast` list into `app/Utils/notificationReminders.ts`.
- [x] Add a new function to schedule feast notifications from `feastDateList`.
- [x] Support single-date feasts (`date`) and range feasts (`dateFrom`, `dateTo`).
- [x] Use existing notification helper (`scheduleNotificationDate`) for scheduling.
- [x] Keep existing daily reminder function unchanged.
- [x] Mark completed steps after implementation.

## Current Task: Share verse gives +1 point

- [x] Update `app/view-chapter.tsx` share handler to add +1 level/point on share tap.
- [x] Persist updated profile using `storeData("PROFILE", updatedProfile)`.
- [x] Keep existing preview behavior (`setIsShowPreview(true)`).
- [x] Show confirmation toast for share reward.
- [x] Mark completed steps after implementation.

## Current Task: iOS-compatible toasts for share/download and points

- [x] Replace `ToastAndroid` usage in `app/view-chapter.tsx` with cross-platform `showToast`.
- [x] Add toast when download/share starts.
- [x] Add toast when points increment is saved.
- [x] Replace timer-based `Level up!` toast with cross-platform toast.
- [x] Mark completed steps after implementation.

## Current Task: Settings font style options (more fonts)

- [ ] Add font selector UI in `app/setting.tsx` (Poppins + Sans/Serif/Monospace).
- [ ] Persist selected `fontStyle` in settings save flow.
- [ ] Add `fontStyle` default in `app/context/SettingContext.tsx`.
- [ ] Apply selected `fontStyle` in `app/view-chapter.tsx` text rendering.
- [ ] Mark completed steps after implementation.

## Current Task: Feast status in Home + username in notifications

- [x] Add feast status informative text/card in `app/home.tsx` (current or incoming feast).
- [x] Include username in daily notification messages.
- [x] Include username in feast notification messages (single/start/end).
- [x] Keep fallback when username is missing.
- [x] Mark completed steps after implementation.

## Current Task: New Moon schedule (Chinese lunisolar basis in PH)

- [ ] Update new moon calculation for Chinese lunisolar basis localized to Philippines.
- [ ] Add new moon reminders in notification scheduling with username.
- [ ] Add new moon informative card in Home (current or incoming).
- [ ] Keep fallback when username is missing in notifications.
- [ ] Mark completed steps after implementation.
