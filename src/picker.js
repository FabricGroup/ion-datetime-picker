'use strict';
/* global moment */
angular.module("ion-datetime-picker", ["ionic"])
  .directive("ionDatetimePicker", function() {
    return {
      restrict: "AE",
      require: "ngModel",
      scope: {
        modelDate: "=ngModel",
        title: "=?",
        subTitle: "=?",
        buttonOk: "=?",
        buttonCancel: "=?",
        monthStep: "=?",
        hourStep: "=?",
        minuteStep: "=?",
        secondStep: "=?",
        onlyValid: "=?",
        operation: "=?",
        period: "=?",
        availableDays: "=?",
        format: "=?",
        times: "=?",
        callback: "&",
        optionPhrase: "=?"
      },
      controller: function($scope, $ionicPopup, $ionicPickerI18n, $timeout, $log, $attrs) {
        $scope.lib = {
          'Monday': 1,
          'Tuesday': 2,
          'Wednesday': 3,
          'Thursday': 4,
          'Friday': 5,
          'Saturday': 6,
          'Sunday': 0
        };
        $scope.defaultFormat = 'YYYY-MM-DD';
        $scope.validDays = [];
        $scope.operations = {};
        $scope.availableDaysMap = {};
        $scope.previousValidDay = '';
        $scope.selectedTime = {
          value: ''
        };
        if (!!$scope.availableDays) {
          var format = !!$scope.format ? $scope.format : $scope.defaultFormat;
          angular.forEach($scope.availableDays, function(value) {
            $scope.availableDaysMap[moment(value.date).format(format)] = value.times;
          });
        }
        if (!!$scope.operation) {
          $scope.validDayOfWeek = {};
          angular.forEach($scope.operation, function(value) {
            $scope.validDayOfWeek[$scope.lib[value.DaysOfWeek]] = true;
          });
        }
        $scope.inclusion = !!$scope.inclusion ? $scope.inclusion : false;
        $scope.dropdownEnabled = !!$scope.times ? true : false;
        $scope.selectTime = function() {
          var selected = $scope.selectedTime.value;
          $scope.hour = selected.split(':')[0];
          $scope.minute = selected.split(':')[1];
          if (!!$scope.previousValidDay) {
            $scope.previousValidDay.setHours($scope.hour, $scope.minute);
          }
          lastDateSet.hour = $scope.hour;
          lastDateSet.minute = $scope.minute;
        };


        function isEmptyObject(obj) {
          var property;
          for (property in obj) {
            return !1;
          }
          return !0;
        }
        $scope.setupOperation = function() {
          if (!!$scope.operation) {
            angular.forEach($scope.operation, function(value) {
              $scope.operations[$scope.lib[value.DaysOfWeek]] = value;
            });
          }
        };
        if (isEmptyObject($scope.operations)) {
          $scope.setupOperation();
        }
        $scope.i18n = $ionicPickerI18n;
        $scope.bind = {};

        $scope.rows = [0, 1, 2, 3, 4, 5];
        $scope.cols = [1, 2, 3, 4, 5, 6, 7];
        $scope.weekdays = [0, 1, 2, 3, 4, 5, 6];

        var lastDateSet = {
          year: $scope.year,
          month: $scope.month,
          day: $scope.day,
          hour: $scope.hour,
          minute: $scope.minute,
          second: $scope.second,
          date: new Date(),
          getDateWithoutTime: function() {
            var tempDate = new Date(this.date);
            tempDate.setHours(0, 0, 0, 0, 0);
            return tempDate;
          }
        };

        $scope.showPopup = function() {
          var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
          $scope.setDefaultSelection(date);
          $ionicPopup.show({
            templateUrl: "lib/ion-datetime-picker/src/picker-popup.html",
            title: $scope.title || ("Pick " + ($scope.dateEnabled ? "a date" : "") + ($scope.dateEnabled && $scope.timeEnabled ? " and " : "") + ($scope.timeEnabled ? "a time" : "")),
            subTitle: $scope.subTitle || "",
            scope: $scope,
            cssClass: 'ion-datetime-picker-popup',
            buttons: [{
              text: $scope.buttonOk || $scope.i18n.ok,
              type: "button-positive",
              onTap: function() {
                $scope.commit();
              }
            }, {
              text: $scope.buttonCancel || $scope.i18n.cancel,
              type: "button-stable",
              onTap: function() {
                $timeout(function() {
                  $scope.processModel();
                }, 200);
              }
            }]
          });
        };

        $scope.prepare = function() {
          if ($scope.mondayFirst) {
            $scope.weekdays.push($scope.weekdays.shift());
          }
        };
        $scope.setDefaultSelection = function(day) {
          var formatTime = moment($scope.hour + $scope.minute, "hhmm").format("HH:mm");
          if (!isEmptyObject($scope.operations)) {
            var temp = $scope.operations[day.getDay()];
            if (!!temp) {
              var start = temp.OpeningAt;
              var end = temp.ClosingAt;
              $scope.times = $scope.makeTimeIntervals(start, end, 15);
              if ($scope.times.indexOf(formatTime) === -1) {
                $scope.hour = start.split(':')[0];
                $scope.minute = start.split(':')[1];
                $scope.selectedTime.value = start;
              } else {
                $scope.hour = formatTime.split(':')[0];
                $scope.minute = formatTime.split(':')[1];
                $scope.selectedTime.value = formatTime;
              }
            } else {
              $scope.setPreviousTime();
            }

          } else if (!!$scope.availableDays) {
            var format = !!$scope.format ? $scope.format : $scope.defaultFormat;
            var formatDate = moment(day).format(format);
            $scope.times = $scope.availableDaysMap[formatDate];
            $scope.times = !!$scope.times ? $scope.times : $scope.availableDaysMap[moment($scope.previousValidDay).format(format)];
            if (!!$scope.times && $scope.times.length >= 0) {
              if ($scope.times.indexOf(formatTime) === -1) {
                $scope.hour = $scope.times[0].split(':')[0];
                $scope.minute = $scope.times[0].split(':')[1];
                $scope.selectedTime.value = $scope.times[0];
              } else {
                $scope.hour = formatTime.split(':')[0];
                $scope.minute = formatTime.split(':')[1];
                $scope.selectedTime.value = formatTime;
              }
            } else {
              $scope.setPreviousTime();
            }
          }
        }
        $scope.setPreviousTime = function() {
          if (!!$scope.previousValidDay) {
            console.log('$scope.previousValidDay ' + $scope.previousValidDay);
            $scope.minute = moment($scope.previousValidDay, $scope.foramt + 'hh:mm').format('mm');
            $scope.selectedTime.value = moment($scope.hour + $scope.minute, "hhmm").format("HH:mm");
          }
        }
        $scope.processModel = function() {
          var date = new Date();
          $scope.year = $scope.dateEnabled ? date.getFullYear() : 0;
          $scope.month = $scope.dateEnabled ? date.getMonth() : 0;
          $scope.day = $scope.dateEnabled ? date.getDate() : 0;
          $scope.hour = $scope.timeEnabled ? date.getHours() : 0;
          $scope.minute = $scope.timeEnabled ? date.getMinutes() : 0;
          var time = $scope.operations[date.getDay()];
          if (!!time) {
            $scope.hour = time.OpeningAt.split(':')[0];
            $scope.minute = time.OpeningAt.split(':')[1] === '00' ? 0 : time.OpeningAt.split(':')[1];
          }
          $scope.setDefaultSelection(date);
          $scope.second = $scope.secondsEnabled ? date.getSeconds() : 0;

          changeViewData();
        };

        function setNextValidDate(date, dayToAdd) {
          $scope.previousValidDay = date;
          dayToAdd = dayToAdd || 0;
          if (dayToAdd !== 0) {
            date.setDate(date.getDate() + dayToAdd);
          }
          lastDateSet.year = date.getFullYear();
          lastDateSet.month = date.getMonth();
          lastDateSet.day = date.getDate();
          lastDateSet.hour = date.getHours();
          lastDateSet.minute = date.getMinutes();
          lastDateSet.second = date.getSeconds();
          lastDateSet.date = date;

        }

        function setLastValidDate() {
          var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
          if ($scope.isEnabled(date.getDate(), true)) {
            setNextValidDate(date);
          } else {
            $scope.year = lastDateSet.year;
            $scope.month = lastDateSet.month;
            $scope.day = lastDateSet.day;
          }

          $scope.setDefaultSelection(date);
        }

        var changeViewData = function() {
          setLastValidDate();
          var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
          if ($scope.dateEnabled) {
            $scope.year = date.getFullYear();
            $scope.month = date.getMonth();
            $scope.day = date.getDate();

            $scope.bind.year = $scope.year;
            $scope.bind.month = $scope.month;

            $scope.firstDay = new Date($scope.year, $scope.month, 1).getDay();
            if ($scope.mondayFirst) {
              $scope.firstDay = ($scope.firstDay || 7) - 1;
            }
            $scope.daysInMonth = getDaysInMonth($scope.year, $scope.month);
          }

          if ($scope.timeEnabled) {
            $scope.hour = date.getHours();
            $scope.minute = date.getMinutes();
            $scope.second = date.getSeconds();
            $scope.meridiem = $scope.hour < 12 ? "AM" : "PM";

            $scope.bind.hour = $scope.meridiemEnabled ? ($scope.hour % 12 || 12).toString() : $scope.hour.toString();
            $scope.bind.minute = ($scope.minute < 10 ? "0" : "") + $scope.minute.toString();
            $scope.bind.second = ($scope.second < 10 ? "0" : "") + $scope.second.toString();
            $scope.bind.meridiem = $scope.meridiem;
          }
        };

        var getDaysInMonth = function(year, month) {
          return new Date(year, month + 1, 0).getDate();
        };

        function validPeriod(hour, mimute) {
          if (!$scope.operation) {
            return true;
          }
          var day = new Date($scope.year, $scope.month, $scope.day);
          var time = $scope.operations[day.getDay()];
          if (!time) {
            return true;
          }
          var startHour = time.OpeningAt.split(':')[0];
          var startMins = time.OpeningAt.split(':')[1];
          var startTime = new Date();
          var endTime = new Date();
          var now = new Date();
          now.setHours(hour, mimute);
          startTime.setHours(startHour, startMins);
          var endHour = time.ClosingAt.split(':')[0];
          var endMins = time.ClosingAt.split(':')[1];
          endTime.setHours(endHour, endMins);
          if (now >= startTime && now <= endTime) {
            return true;
          }
          return false;
        }
        $scope.changeBy = function(value, unit) {
          if (+value) {
            // DST workaround
            if ((unit === "hour" || unit === "minute") && value === -1) {
              var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour - 1, $scope.minute);
              if (($scope.minute === 0 || unit === "hour") && $scope.hour === date.getHours()) {
                $scope.hour--;
              }
            }
            $scope[unit] += +value;
            if (!validPeriod($scope.hour, $scope.minute)) {
              $scope[unit] -= +value;
            }
            if($scope.timePeriodEnabled){
                $scope.getNextPageSelection(value);
            }
            if ((unit === "month" || unit === "year") && !$scope.timePeriodEnabled) {
              $scope.day = Math.min($scope.day, getDaysInMonth($scope.year, $scope.month));
            }
            changeViewData();
          }
        };
        $scope.getNextPageSelection = function(value){
          var keepGoing = true;
          if(!!$scope.availableDaysMap){
            angular.forEach($scope.availableDaysMap,function(key,value){
              if(keepGoing) {
                var month = moment(value).format('MM');
                if(month === $scope.month+1+''){
                  $scope.day =  moment(value).format('DD');
                  keepGoing = false;
                }
              }
            });
          }
          if(!!$scope.period){
            var endDay = moment($scope.period.to);
            var fromDay = moment($scope.period.from);
            var firstDayOfMonth = moment(new Date($scope.year, $scope.month, 1));
            var endDayOfMonth = moment(new Date($scope.year, $scope.month, getDaysInMonth($scope.year, $scope.month)));
            var dayOfWeek;
            if(value > 0){
              do{
                dayOfWeek = firstDayOfMonth.format("E");
                if(!!$scope.validDayOfWeek[dayOfWeek]){
                  keepGoing = false;
                  $scope.day = firstDayOfMonth.format("DD");
                }
                firstDayOfMonth = firstDayOfMonth.add(1, 'd');
              }while(firstDayOfMonth<=endDay && keepGoing);
            }else{
              do{
                dayOfWeek = endDayOfMonth.format("E");
                if(!!$scope.validDayOfWeek[dayOfWeek]){
                  keepGoing = false;
                  $scope.day = endDayOfMonth.format("DD");
                }
                endDayOfMonth = endDayOfMonth.add(-1, 'd');
              }while(endDayOfMonth >= fromDay && keepGoing);
            }
          }
        };
        $scope.change = function(unit) {
          var value = $scope.bind[unit];
          if (value && unit === "meridiem") {
            value = value.toUpperCase();
            if (value === "AM" && $scope.meridiem === "PM") {
              $scope.hour -= 12;
            } else if (value === "PM" && $scope.meridiem === "AM") {
              $scope.hour += 12;
            }
            changeViewData();
          } else if (+value || +value === 0) {
            $scope[unit] = +value;
            if (unit === "month" || unit === "year") {
              $scope.day = Math.min($scope.day, getDaysInMonth($scope.year, $scope.month));
            }
            changeViewData();
          }
        };
        $scope.changeDay = function(day) {
          $scope.day = day;
          var date = new Date($scope.year, $scope.month, day);

          changeViewData();
        };

        function createDate(stringDate) {
          var date = new Date(stringDate);
          var isInvalidDate = isNaN(date.getTime());
          if (isInvalidDate) {
            date = new Date(); //today
          }
          date.setHours(0, 0, 0, 0, 0);
          return date;
        }

        function setValidTime(key, isScope) {

          if (!!$scope.operations && !!$scope.operations[key]) {
            var time = $scope.operations[key];
            var hour = time.OpeningAt.split(':')[0];
            var mins = time.OpeningAt.split(':')[1];
            if (isScope) {
              $scope.hour = hour;
              $scope.minute = mins;
            } else {
              if (!!$scope.previousValidDay) {} else {
                lastDateSet.hour = hour;
                lastDateSet.minute = mins;
              }
            }
          }
        }

        function getValidDay(initialDate, finalDate, currentDate, isValidRange) {
          if (isValidRange && $scope.validDays.length > 0) {
            setValidTime($scope.validDays[0].getDay());
            return;
          }
          var step = 0;
          var up = new Date(currentDate.getTime());
          var down = new Date(currentDate.getTime());
          do {
            up.setDate(up.getDate() + step);
            down.setDate(down.getDate() - step);
            if (!!$scope.operations[up.getDay()] && up <= finalDate) {
              setNextValidDate(up, 0);
              setValidTime(up.getDay());
              $scope.setDefaultSelection(up);
              break;
            }
            if (!!$scope.operations[down.getDay()] && down >= initialDate) {
              setNextValidDate(down, 0);
              setValidTime(down.getDay());
              $scope.setDefaultSelection(down);
              break;
            }
            step++;
          } while (up <= finalDate || down >= initialDate);
        }
        $scope.isEnabled = function(day, computeNextValidDate) {
          var currentDate = new Date($scope.year, $scope.month, day);
          var isValid = true;
          var initialDate;
          var finalDate;
          var lastValidDate = lastDateSet.getDateWithoutTime();
          var currentDay = currentDate.getDay();
          if (!!$scope.availableDays) {
            var format = !!$scope.format ? $scope.format : $scope.defaultFormat;
            var now = moment(currentDate).format(format);
            isValid = false;
            for (var i = 0; i < $scope.availableDays.length; i++) {
              if (now === moment($scope.availableDays[i].date).format(format)) {
                isValid = true;
                break;
              }
            }
            if (!isValid) {
              setNextValidDate(!!$scope.previousValidDay ? $scope.previousValidDay : createDate($scope.availableDays[0].date), 0);
              $scope.setDefaultSelection(!!$scope.previousValidDay ? $scope.previousValidDay : createDate($scope.availableDays[0].date));
            }
          } else if (!!$scope.operation) {
            var start;
            var end;
            if (!!$scope.period.from && !!$scope.period.to) {
              start = createDate($scope.period.from);
              end = createDate($scope.period.to);
              isValid = currentDate >= start && currentDate <= end;
            } else if (!!$scope.period.from && !$scope.period.to) {
              end = createDate($scope.period.to);
              isValid = currentDate >= start;
            } else if (!$scope.period.from && !!$scope.to) {
              start = createDate($scope.period.from);
              isValid = currentDate <= end;
            } else {
              isValid = true;
            }
            if (isValid && !$scope.operations[currentDay]) {
              getValidDay(start, end, currentDate, true);
              return false;
            } else {
              if (!isValid && computeNextValidDate && currentDate >= end) {
                if (!!$scope.previousValidDay) {
                  setNextValidDate($scope.previousValidDay, 0);
                } else {
                  getValidDay(start, end, end, false);
                }
              } else if (!isValid && computeNextValidDate && currentDate <= start) {
                if (!!$scope.previousValidDay) {
                  setNextValidDate($scope.previousValidDay, 0);
                } else {
                  getValidDay(start, end, start, false);
                }
              } else {
                $scope.validDays.push(currentDate);
              }

            }
          } else if ($scope.onlyValid && $scope.onlyValid.after) {

            var afterDate = createDate($scope.onlyValid.after);

            if ($scope.onlyValid.inclusive) {
              isValid = currentDate >= afterDate;
              if (!isValid && computeNextValidDate) {
                setNextValidDate(afterDate, 0);
              }
            } else {
              isValid = currentDate > afterDate;
              if (!isValid && computeNextValidDate) {
                setNextValidDate(afterDate, 1);
              }
            }

          } else
          if ($scope.onlyValid && $scope.onlyValid.before) {

            var beforeDate = createDate($scope.onlyValid.after);

            if ($scope.onlyValid.inclusive) {
              isValid = currentDate <= beforeDate;
              if (!isValid && computeNextValidDate) {
                setNextValidDate(beforeDate, 0);
              }
            } else {
              isValid = currentDate < beforeDate;
              if (!isValid && computeNextValidDate) {
                setNextValidDate(beforeDate, -1);
              }
            }

          } else
          if ($scope.onlyValid && $scope.onlyValid.between) {
            initialDate = createDate($scope.onlyValid.between.initial);
            finalDate = createDate($scope.onlyValid.between.final);
            if ($scope.onlyValid.inclusive) {
              isValid = currentDate >= initialDate && currentDate <= finalDate;
              if (!isValid && computeNextValidDate) {
                if (currentDate < initialDate) {
                  setNextValidDate(initialDate, 0);
                }
                if (currentDate > finalDate) {
                  setNextValidDate(finalDate, 0);
                }
              }
            } else {
              isValid = currentDate > initialDate && currentDate < finalDate;
              if (!isValid && computeNextValidDate) {
                if (currentDate <= initialDate) {
                  setNextValidDate(initialDate, 1);
                }
                if (currentDate >= finalDate) {
                  setNextValidDate(finalDate, -1);
                }
              }
            }

          } else
          if ($scope.onlyValid && $scope.onlyValid.outside) {
            initialDate = createDate($scope.onlyValid.outside.initial);
            finalDate = createDate($scope.onlyValid.outside.final);
            if ($scope.onlyValid.inclusive) {
              isValid = currentDate <= initialDate || currentDate >= finalDate;
              if (!isValid && computeNextValidDate) {
                if (lastValidDate <= initialDate) {
                  setNextValidDate(finalDate, 0);
                }
                if (lastValidDate >= finalDate) {
                  setNextValidDate(initialDate, 0);
                }
              }
            } else {
              isValid = currentDate < initialDate || currentDate > finalDate;
              if (!isValid && computeNextValidDate) {
                if (lastValidDate < initialDate) {
                  setNextValidDate(finalDate, 1);
                }
                if (lastValidDate > finalDate) {
                  setNextValidDate(initialDate, -1);
                }
              }
            }
          }
          return isValid;

        };
        $scope.changed = function() {
          changeViewData();
        };
        $scope.makeTimeIntervals = function(startTime, endTime, increment) {
          var temp = endTime;
          startTime = startTime.toString().split(':');
          endTime = endTime.toString().split(':');
          increment = parseInt(increment, 10);

          var pad = function(n) {
              return (n < 10) ? '0' + n.toString() : n;
            },
            startHr = parseInt(startTime[0], 10),
            startMin = parseInt(startTime[1], 10),
            endHr = parseInt(endTime[0], 10),
            endMin = parseInt(endTime[1], 10),
            currentHr = startHr,
            currentMin = startMin,
            previous = (currentHr < 10 ? '0' + currentHr : currentHr) + ':' + pad(currentMin),
            current = '',
            r = [];

          do {
            currentMin += increment;
            if ((currentMin % 60) === 0 || currentMin > 60) {
              currentMin = (currentMin === 60) ? 0 : currentMin - 60;
              currentHr += 1;
            }
            if (currentHr < 10) {
              current = '0' + currentHr + ':' + pad(currentMin);
            } else {
              current = currentHr + ':' + pad(currentMin);
            }
            r.push(previous);
            previous = current;
          } while (currentHr < endHr || previous < endHr);
          r.push(temp);
          return r;
        };
        if ($scope.dateEnabled) {
          $scope.$watch(function() {
            return new Date().getDate();
          }, function() {
            var today = new Date();
            $scope.today = {
              day: today.getDate(),
              month: today.getMonth(),
              year: today.getFullYear()
            };
          });
        }
      },
      link: function($scope, $element, $attrs, ngModelCtrl) {
        $scope.$watch('model', function() {
          $scope.$eval($attrs.ngModel + ' = modelDate');
        });

        $scope.$watch($attrs.ngModel, function(val) {
          $scope.modelDate = val;
        });
        $scope.dateEnabled = "date" in $attrs && $attrs.date !== "false";
        $scope.timeEnabled = "time" in $attrs && $attrs.time !== "false";
        $scope.timePeriodEnabled = !!$attrs.availableDays || !!$attrs.period || !!$attrs.operation;
        if ($scope.dateEnabled === false && $scope.timeEnabled === false) {
          $scope.dateEnabled = $scope.timeEnabled = true;
        }

        $scope.mondayFirst = "mondayFirst" in $attrs && $attrs.mondayFirst !== "false";
        $scope.secondsEnabled = $scope.timeEnabled && "seconds" in $attrs && $attrs.seconds !== "false";
        $scope.meridiemEnabled = $scope.timeEnabled && "amPm" in $attrs && $attrs.amPm !== "false";

        $scope.monthStep = +$scope.monthStep || 1;
        $scope.hourStep = +$scope.hourStep || 1;
        $scope.minuteStep = +$scope.minuteStep || 1;
        $scope.secondStep = +$scope.secondStep || 1;
        $scope.prepare();
        ngModelCtrl.$render = function() {
          $scope.modelDate = ngModelCtrl.$viewValue;
          $scope.processModel();
        };
        $scope.commit = function() {
          $scope.modelDate = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
          ngModelCtrl.$setViewValue($scope.modelDate);
          $scope.callback({
            'callback': $scope.modelDate
          });
        };
        $element.on("click", $scope.showPopup);
      }
    };
  });
