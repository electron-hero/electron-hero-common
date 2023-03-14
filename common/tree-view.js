marginSize = 21;
var folderCnt = 1;

function onDrop(ev, target, title) {
	// var src = ev.dataTransfer.getData("Text");
	// ev.target.appendChild(document.getElementById(src));
	// console.log(ev);
	// console.log('here in drop');
	// console.log(ev);

	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	console.log(data);
	console.log(target.id);
	console.log(dropOnTitleText);
}

function onDragStart(evt) {
	evt.dataTransfer.setData("text", evt.target.id);
}

function onDragOver(evt) {
	evt.preventDefault()

}

function onDragEnter(evt) {
	evt.preventDefault()
}

function addFolder(_folderName, elementToAppendTo, _path) {
	var folderName;

	console.log('here in add folder');
	console.log(_folderName);

	if (typeof(_folderName) !== 'string') {
		folderName = _folderName.name
	} else {
		folderName = _folderName;
	}

	if (_.isEmpty(_path)) {
		_path = _folderName.folderChildren;
	}
	var newRow = $.parseHTML(newFolderHTML);
	$(newRow).attr('id', 'folderId-' + folderCnt);
	folderCnt += 1;
	var newMargin = $(elementToAppendTo).data('margin');
	if (newMargin === undefined) {
        newMargin = 0 - marginSize;
    }
    newMargin += marginSize;
	$(newRow).find('.opener').css('margin-left', newMargin + 'px');
	$(newRow).find('.nav-item-text').html(folderName);

	if (!_.isEmpty(_path)) {
		if (typeof(_path) === 'object') {
			console.log('a');
			console.log(_path);
			$(newRow).find('.nav-item-text').data('path', _path);
		} else {
			console.log('b');
			console.log(_path);
			$(newRow).find('.nav-item-text').data('path', path.join(_path, folderName));
		}
	} else {
		console.log('emtpy path');
		console.log(folderName);
	}
	$(newRow).find('.nav-item-text').data('entryType', 'folder');
	$(newRow).find('.nav-item-text').data('folderJSON', _folderName);
	$(newRow).find('.nav-item-text').data('id', _folderName.id);


	$(newRow).find('.content-area').toggle(false);
	$(newRow).find('.content-area').data('margin', newMargin);
	$(newRow).data('margin',newMargin);

	elementToAppendTo.append(newRow);

}

function addFile(_fileName, elementToAppendTo, _path) {
	console.log('here in add file...');
	console.log(_fileName);
	var fileName;
	var fileId;
	if (typeof(_fileName) !== 'string') {
		fileName = _fileName.name;
		fileId = _fileName.id;
	} else {
		fileName = _fileName;
	}

	var newRow = $.parseHTML(newFileHTML);
	var newMargin = $(elementToAppendTo).data('margin')
    if (newMargin === undefined) {
        newMargin = 0 - marginSize
	}
	newMargin += (marginSize*2)
	$(newRow).find('.icon-doc-text').css('margin-left', newMargin + 'px');
	$(newRow).find('.nav-item-text').html(fileName);

	// console.log(_path);
	// console.log(typeof(_path));
	if (typeof(_path) !== 'string') {
		$(newRow).find('.nav-item-text').data('path', _path);
	} else {
		$(newRow).find('.nav-item-text').data('path', path.join(_path, fileName));
	}

	console.log(_fileName);

	$(newRow).find('.nav-item-text').data('entryType', 'file');
	$(newRow).find('.nav-item-text').data('id', fileId);

	$(newRow).find('.nav-item-text').data('extraInfo', _fileName.extraInfo);

	elementToAppendTo.append(newRow);
}

function addTopLevelFolder(folderName, elementToAppendTo, _path) {

	var newRow = $.parseHTML(topLevelFolder);
	$(newRow).find('.nav-item-text').html(folderName);
	$(newRow).find('.icon-folder').css('margin-left', marginSize + 'px');
	$(elementToAppendTo).data('margin',0)
	$(newRow).find('.nav-item-text').data('entryType', 'top-folder');
	//$(newRow).find('.nav-item-text').data('path', _path);
	$(newRow).data('margin',  '1')
	elementToAppendTo.append(newRow);
}

var newFolderHTML = '<span class="nav-group-item noDropBorder" draggable="true" ondragstart="onDragStart(event)" ondragover="onDragOver(event)" ondragenter="onDragEnter(event)" ondrop="onDrop(event, this)">' +
	'<span class="icon opener icon-right-dir">' +
	'</span><span class="icon icon-folder"></span>' +
	'<span class="nav-item-text folder-item">libs</span>' +
	'<div class="content-area" ></div>' +
	'</span>';

var newFileHTML = '<span  class="nav-group-item">' +
	'<span class="icon icon-doc-text one-deep"></span>' +
	'<span class="nav-item-text clickable-nav-item file-item">libs</span>' +
	'</span>';

var topLevelFolder = '<span class="nav-group-item">' +
	'<span class="icon icon-folder"></span>' +
	'<span class="nav-item-text folder-item">libs</span>' +
	'</span>';


function handleItemClick() {
	var fileType = $(this).data('entryType');

	console.log($(this).data());


	var filePath = $(this).data('path');
	var fileId = $(this).data('id')
    $('.fileType').html(fileType + ' ' + fileId);
	$('.filePath').html(filePath);
}


function handleFileItemClick() {
	console.log('here in file item click');
	$('#files .nav-group-item').removeClass('file-active');
	var fileItem = $(this).closest('.nav-group-item');
	var text = $(this).closest('.nav-item-text');
	$(fileItem).addClass('file-active');
}

function handleOpenerClick() {
	var icon = $(this);
	console.log('here in opener');
	if ($(this).hasClass('icon-right-dir')) {
		$(icon).removeClass('icon-right-dir')
		$(icon).addClass('icon-down-dir');
		var content = $(this).closest('.nav-group-item').find('.content-area');
		// check to see if we need to add something inside this one
		if ($(content).children().length === 0) {

			var itemText = $(this).closest('.nav-group-item').find('.nav-item-text');
			var fileType = $(itemText).data('entryType');
			var filePath = $(itemText).data('path');
			var filesToAdd = [];
			var foldersToAdd = [];

			_.each(filePath, function(item){
				if (item.type === 'folder') {
					console.log('adding folder');
					console.log(item);
					foldersToAdd.push(item)
				}
				if (item.type === 'file') {
					console.log('adding file')
					console.log(item.id)
					filesToAdd.push(item);
				}
			})

			_.each(foldersToAdd, function(item) {
				console.log('filePath');
				console.log(filePath);
				console.log(item);
				addFolder(item, content, filePath.folderChildren);
			})
			_.each(filesToAdd, function(item) {
				addFile(item, content, filePath);
			})
		}
		$(content).first().toggle(true);
	} else {
		$(icon).removeClass('icon-down-dir')
		$(icon).addClass('icon-right-dir');
		var content = $(this).closest('.nav-group-item').find('.content-area');
		$(content).first().toggle(false);
	}
}

function caseInesensitiveSort(a, b) {
	if (a.toLowerCase() < b.toLowerCase()) return -1;
	if (a.toLowerCase() > b.toLowerCase()) return 1;
	return 0;
}


function buildTreeViewFromJSON(elementToAppendTo, json) {

	//$(elementToAppendTo).empty();
	var filesToAdd = [];
	var foldersToAdd = [];
	var topFolderName = 'bite me';
	folderCnt = 1;

	_.each(json.items, function(item){
		//console.log(item.folderChildren);
		addFolder(item, $(elementToAppendTo), item.folderChildren);
	})
}


function buildTreeView(elementToAppendTo, pathToStart) {
	// when we're here we're starting from scratch
	$(elementToAppendTo).empty();
	var filesToAdd = [];
	var foldersToAdd = [];
	var topFolderName = pathToStart.split(path.sep).slice(-1)[0];

	if ((fs.lstatSync(pathToStart).isDirectory())) {

		addTopLevelFolder(topFolderName, $(elementToAppendTo), pathToStart)
		fs.readdir(pathToStart, function(err, files) {
			//handling error
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			}
			files.forEach(function(file) {
				if (file.substr(0, 9) != '.DS_Store') {
					if (fs.lstatSync(path.join(pathToStart, file)).isDirectory()) {
						foldersToAdd.push(file);
					} else {
						filesToAdd.push(file);
					}
				}
			});
			_.each(foldersToAdd, function(item) {
				addFolder(item, $(elementToAppendTo), pathToStart);
			})

			filesToAdd = filesToAdd.sort(caseInesensitiveSort);

			_.each(filesToAdd, function(item) {
				addFile(item, $(elementToAppendTo), pathToStart);
			})
		});

	} else {

		var folderPathForFile = pathToStart.split(path.sep);
		var fileName = pathToStart.split(path.sep).slice(-1)[0];
		folderPathForFile.pop();
		folderPathForFile = folderPathForFile.join(path.sep);
		var folderName = folderPathForFile.split(path.sep).slice(-1)[0];
		addTopLevelFolder(folderName, $(elementToAppendTo, pathToStart))
		addFile(fileName, $(elementToAppendTo), folderPathForFile);

	}
}
