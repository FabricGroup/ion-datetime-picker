# ion-datetime-picker-fabric

The oraginal use please refer below URL:
[ion-datetime-picker](https://github.com/katemihalikova/ion-datetime-picker)
# Introduction

This is the forked one and enhance some paticular funcitons we used.

# Features

The ion-datetime-picker component has these features:
- Make Date picker, Time picker, Datetime picker
- Choose Sunday or Monday as the first day of the week
- Use 12-hour or 24-hour clock
- Pick time with or without seconds
- Configure popup title and button labels and classes
- Configure i18n to get weekdays and months in your language
- Configure size of a step

# Features - New


1. Add time period selection to support customize time list.
2. Add day of week restriction to enable/disable the day you want.

   Disable all Saturdays
3. Add days restriction to enable/disable the days you want.
   Disable paticular days.


# Installation

1. Use bower to install the new module:

    ```bash
    bower install "https://github.com/FabricGroup/ion-datetime-picker.git#master" --save
    ```

2. Import the `ion-datetime-picker` javascript and css file into your HTML file (or use [wiredep](https://github.com/taptapship/wiredep)):

   ```html
   <script src="lib/ion-datetime-picker/release/ion-datetime-picker.min.js"></script>
   <link href="lib/ion-datetime-picker/release/ion-datetime-picker.min.css" rel="stylesheet">
   ```

3. Add `ion-datetime-picker` as a dependency on your Ionic app:

   ```javascript
   angular.module("myApp", ["ionic", "ion-datetime-picker"]);
   ```

# Usage

Put the `ion-datetime-picker` directive alongside the `ng-model` wherever you want to tap to show the picker:

```html
<ion-list>
    <div class="item" ion-datetime-picker ng-model="datetimeValue">
        {{datetimeValue| date: "yyyy-MM-dd H:mm:ss"}}
    </div>
</ion-list>
```

*It is not possible to use `<ion-item>` until [#18](https://github.com/katemihalikova/ion-datetime-picker/issues/18) is fixed.*


## Configuration attributes

### `date` and `time` attributes

Choose which picker type is used. When neither is set, I assume both and use the datetime picker.

### `monday-first` attribute

Set this if you want to have Monday as the first day of a week.

### `seconds` attribute

By default, in the time picker, I allow to change only hours and minutes. Set this attribute to use also seconds.

### `am-pm` attribute

By default, in the time picker, I use 24-hour clock. Set this attribute to change it to 12-hour clock.

### `month-step`, `hour-step`, `minute-step` and `second-step` attributes

By default, when any caret button is tapped, I add or subtract 1 particular unit. Set these attributes to change it to anything you want.

### `title` and `sub-title` attributes

Configure the title and sub title of the popup with the picker.

_HINT: Use `data-title` instead of `title` if you are going to use the app in the desktop browser to prevent leaking of the text into a mouseover tooltip._

### `button-ok` and `button-cancel` attributes

Configure the text of buttons at the bottom of the picker.

### `only-valid` attribute

Disable/Enable calendar days according to type and date range specified.

```html
only-valid="{'after': '2016-04-09'}"
only-valid="{'after': 'today', 'inclusive': true}"
only-valid="{'outside': {'initial': '2016-04-09', 'final': '2016-06-15'}, 'inclusive': true}"
```
Types supported: `'after'`, `'before'`, `'between'` and `'outside'`. If you want to include the day specified, set `'inclusive'` property to `true`.

### `operation` attribute

Disable/Enable calendar times according to specified time range format

```html
	operation = [{'ClosingAt':'17:00:00','OpeningAt':'09:00:00','DaysOfWeek':'Monday','isClosed':''},
                                      {'ClosingAt':'17:00:00','OpeningAt':'09:00:00','DaysOfWeek':'Tuesday','isClosed':''}]
```

### `timePeriod` attribute

Disable/Enable calendar days according to specified data range format
```html
	period = {'from':'','to':''}
```

### `callback` attribute

Enable callback function to specified paticular function.


### `available-days` attribute

Disable/Enable calendar days according to specified days
```html
	available-days = [
        {
            "date": "2016-10-27",
            "times": [
                "07:00",
                "07:15",
                "07:30",
                "07:45",
                "08:00",
                "08:15",
                "08:30",
                "08:45",
                "09:00",
                "09:15",
                "09:30",
                "09:45",
                "10:00",
                "10:15",
                "10:30",
                "10:45",
                "11:00",
                "11:15",
                "11:30",
                "11:45",
                "12:00",
                "12:15",
                "12:30",
                "12:45",
                "13:00",
                "13:15",
                "13:30",
                "13:45",
                "14:00",
                "14:15",
                "14:30",
                "14:45"
            ]
        }]
```

## Internationalization & customization factory

Simple internationalization & customization options. Inject the `$ionicPickerI18n` factory into your code and set the localized strings and button classes.

### `weekdays` key

Array of weekdays abbreviations. `0` is Sunday. If `moment` is installed, I try to get localized data from it, otherwise English ones are used as default.

### `months` key

Array of months names. `0` is January. If `moment` is installed, I try to get localized data from it, otherwise English ones are used as default.

### `ok` and `cancel` keys

Default, global labels of the buttons at the bottom of the picker.

### `okClass` and `cancelClass` keys

Custom space-delimited classes applied to the buttons at the bottom of the picker.

```js
angular.module("myApp")
    .run(function($ionicPickerI18n) {
        $ionicPickerI18n.weekdays = ["Нд", "Lu", "Út", "Mi", "To", "금", "Sá"];
        $ionicPickerI18n.months = ["Janvier", "Febrero", "März", "四月", "Maio", "Kesäkuu", "Červenec", "अगस्त", "Вересень", "Październik", "Νοέμβριος", "డిసెంబర్"];
        $ionicPickerI18n.ok = "オーケー";
        $ionicPickerI18n.cancel = "Cancelar";
        $ionicPickerI18n.okClass = "button-positive";
        $ionicPickerI18n.cancelClass = "button-stable";
    });
```

## Daylight saving time

The datetime picker is using `Date` object with your browser's timezone, including any DST. When you change the date, hour, minute, or second, which sets the time to an invalid value because of moving from 2:00 to 3:00 at the beginning of DST, the time is automatically adjusted to a valid value. On the other hand, when the DST ends, I do NOT take the inserted hour into consideration, but this may be fixed in the future.


## Demo Instance
####For request:

```
<label class="item item-input item-select item-icon mandatory"
    ng-model=""
    ion-datetime-picker date
    operation="[
    {'ClosingAt':'17:00:00','OpeningAt':'09:00:00','DaysOfWeek':'Wednesday','isClosed':''},
    {'ClosingAt':'17:00:00','OpeningAt':'09:00:00','DaysOfWeek':'Saturday','isClosed':''},
    {'ClosingAt':'17:00:00','OpeningAt':'09:00:00','DaysOfWeek':'Tuesday','isClosed':''}]"
    period = "{'from':'2016-10-10','to':'2016-11-20'}"
    callback = "">
    </label>
 ```
####For book:

```
<label
    ng-model="dropDate"
    class="item item-input item-select item-icon mandatory"
    ion-datetime-picker date
    available-days = "[
        {
            'date': '2016-10-27',
            'times': [
                '07:00',
                '07:15'
            ]
        },{
            'date': '2016-11-03',
            'times': [
                '07:00',
                '07:15'
            ]
        }]"
    callback = "">
    </label>
```
