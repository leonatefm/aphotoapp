var app = angular.module('app', [])

app.controller('ctrl', function($scope) {
  $scope.myFiles = [];
  $scope.myFilesCount = 0;
  //controller code here
  $scope.$watch('myFilesCount', function(){
	 console.log($scope.myFiles);
  })

  $scope.removeFile = function(fileIndex){
	console.log('Removing file:' + fileIndex);
	$scope.myFiles.splice(fileIndex, 1);
	$scope.myFilesCount--;
  }

  var downloadURL = function(url, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
  }

  $scope.downloadFile = function(fileIndex){
	console.log('Downloading file: ' + fileIndex);

	var file = $scope.myFiles[fileIndex];
	var canvas = document.createElement('canvas');
	var img = document.getElementById('photo-'+fileIndex);

	var borderSize = img.naturalWidth * 0.03;
	canvas.width = img.naturalWidth + borderSize * 2;
	canvas.height = img.naturalHeight + borderSize * 2;

	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	ctx.drawImage(img, borderSize, borderSize);

	canvas.toBlob(function(blob){
	  downloadURL(URL.createObjectURL(blob), 'processed - '+file.name);
	}, 'image/jpg', 0.95);


  }

});

app.directive('selectFiles', [function () {
	return {
		restrict: 'A',
		scope:{
		  selectFiles: '=',
		  filesCount: '='
		},
		link: function(scope, element, attrs) {

			element.on('change', function(){
				var files = element[0].files;
				var count = element[0].files.length;
				scope.filesCount += count;
				for(var i=0; i<count; i++){
				  files[i].UIID = "_" + new Date().valueOf() + Math.random().toFixed(16).substring(2);
				  scope.selectFiles.push(files[i]);
				}

				scope.$apply();
			});
		}
	};
}]);

app.directive('dropFiles', [function () {
	return {
		restrict: 'A',
		scope:{
		  dropFiles: '=',
		  filesCount: '='
		},
		link: function(scope, element, attrs) {

		  element.on('dragover', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
		  element.on('dragenter', function(e) {
			console.log('enter');
			  element.addClass('dragover');
				e.preventDefault();
				e.stopPropagation();
			});

		  element.on('dragleave', function(e) {
			console.log('leave');
			  element.removeClass('dragover');
				e.preventDefault();
				e.stopPropagation();
			});

			element.on('drop', function(e){
			  element.removeClass('dragover');
				e.preventDefault();
				e.stopPropagation();
				if (e.dataTransfer && e.dataTransfer.files){
					var files = e.dataTransfer.files;
					var count = e.dataTransfer.files.length;
					scope.filesCount += count;
					for(var i=0; i<count; i++){
					  files[i].UIID = "_" + new Date().valueOf() + Math.random().toFixed(16).substring(2);
					  scope.dropFiles.push(files[i]);
					}
					scope.$apply();
				}

			});
		}
	};
}]);

app.directive('previewImage', [function () {
	return {
		restrict: 'A',
		scope:{
		  previewImage: '=',
		},
		link: function(scope, element, attrs) {
		  if(scope.previewImage && scope.previewImage.type.indexOf('image')>=0){
			var image = URL.createObjectURL(scope.previewImage);
		  }else{
			var image = 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/12.File-512.png';
		  }
			element.attr('src', image);
			console.log(element);
		}
	};
}]);