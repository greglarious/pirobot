angular.module('ui.bootstrap.ams', ['ui.bootstrap']);
angular.module('ui.bootstrap.ams').controller('ConnectController', function ($scope, $window) {
    $scope.ws_url = "ws://192.168.1.4:8090/events/";
    $scope.connected = false;
    $scope.distance = 0;
    $scope.leftline="nodata"
    $scope.rightline="nodata"
    $scope.websocket = {}

    function getQueryParameter ( parameterName, defaultValue ) {
      var queryString = window.top.location.search.substring(1);
      var parameterName = parameterName + "=";
      if ( queryString.length > 0 ) {
        begin = queryString.indexOf ( parameterName );
        if ( begin != -1 ) {
          begin += parameterName.length;
          end = queryString.indexOf ( "&" , begin );
            if ( end == -1 ) {
            end = queryString.length
          }
          return unescape ( queryString.substring ( begin, end ) );
        }
      }
      return defaultValue;
    }

    function showSentMessage(message) {
        var sent_messages = document.getElementById('sent_messages');
        sent_messages.value = sent_messages.value + message + "\n\n";
        sent_messages.scrollTop = sent_messages.scrollHeight;
    }

    function showReceivedMessage(message) {
            var received_messages = document.getElementById('received_messages');
            received_messages.value = received_messages.value + message + "\n\n";
            received_messages.scrollTop = received_messages.scrollHeight;
    }

    $scope.sendCommandMessage = function(message) {
        showSentMessage(message);
        $scope.websocket.send(message);
    }


    $scope.connect = function() {
        $scope.websocket = new WebSocket($scope.ws_url);

        $scope.websocket.onopen = function(evt) { onOpen(evt) };
        $scope.websocket.onclose = function(evt) { onClose(evt) };
        $scope.websocket.onmessage = function(evt) { onMessage(evt) };
        $scope.websocket.onerror = function(evt) { onError(evt) };

        function onOpen(evt) {
            $scope.connected = true;
            $scope.$apply()
        }

        function onClose(evt) { $scope.connected = false; }

        function onMessage(event) {
            showReceivedMessage(event.data);
            if (event.data.indexOf("distance:") == 0) {
                $scope.distance = event.data.substring(9)
                $scope.$apply()
            }
            else if (event.data.indexOf("line1:") == 0) {
                 $scope.leftline = event.data.substring(6)
                 $scope.$apply()
            }
            else if (event.data.indexOf("line2:") == 0) {
                  $scope.rightline = event.data.substring(6)
                  $scope.$apply()
            }

        }

        function onError(evt) {
            showReceivedMessage("error:" + evt.data)
        }
    }

    $scope.disconnect = function() {
        $scope.websocket.close();;
    }

  });
