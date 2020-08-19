const test = require('ava');
const _app = require('.');

test('application', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:51182/XEPDB1',
		directory: './demo/demo-working/',
		appID: 101
	});

	t.pass();
});

test('workspace', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:51182/XEPDB1',
		directory: './demo/demo-working/',
		appID: 101,
		destination: 'workspace'
	});

	t.pass();
});

test('theme', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:51182/XEPDB1',
		directory: './demo/demo-working/',
		appID: 101,
		destination: 'theme'
	});

	t.pass();
});

test('alias', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:51182/XEPDB1',
		directory: './demo/demo-working/',
		appID: 'PUBLISH'
	});

	t.pass();
});

test('plugin', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:51182/XEPDB1',
		directory: './demo/demo-working/',
		appID: 101,
		destination: 'plugin',
		pluginName: 'ME.VMORNEAU.ANIMAPEX'
	});

	t.pass();
});

test('empty', t => {
	try {
		_app.publish({
			sqlclPath: 'sql',
			connectString: 'dev/dev@localhost:51182/XEPDB1',
			directory: './demo/demo-empty/',
			appID: 101
		});

		t.pass();
	} catch (error) {
		if (error instanceof Error) {
			t.pass();
		}
	}
});

test('invalid-path', t => {
	try {
		_app.publish({
			sqlclPath: 'sql',
			connectString: 'dev/dev@localhost:51182/XEPDB1',
			directory: './demo/demo-invalid/',
			appID: 101
		});
	} catch (error) {
		if (error instanceof Error) {
			t.pass();
		}
	}
});

test('file', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:51182/XEPDB1',
		directory: './demo/demo-working/js/app.js',
		appID: 101
	});

	t.pass();
});
