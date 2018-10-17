import test from 'ava';
import _app from '.';

test('application', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
		directory: './demo/demo-working/',
		appID: 105990
	});

	t.pass();
});

test('workspace', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
		directory: './demo/demo-working/',
		appID: 105990,
		destination: 'workspace'
	});

	t.pass();
});

test('theme', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
		directory: './demo/demo-working/',
		appID: 105990,
		destination: 'theme'
	});

	t.pass();
});

test('alias', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
		directory: './demo/demo-working/',
		appID: 'DEMO'
	});

	t.pass();
});

test('plugin', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
		directory: './demo/demo-working/',
		appID: 105990,
		destination: 'plugin',
		pluginName: 'ME.VMORNEAU.ANIMAPEX'
	});

	t.pass();
});

test('empty', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
		directory: './demo/demo-empty/',
		appID: 105990
	});

	t.pass();
});

test('invalid-path', t => {
	try {
		_app.publish({
			sqlclPath: 'sql',
			connectString: 'dev/dev@localhost:32122/orclpdb1810.localdomain',
			directory: './demo/demo-invalid/',
			appID: 105990
		});
	} catch (error) {
		if (error instanceof Error) {
			t.pass();
		}
	}
});
