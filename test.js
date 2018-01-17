import test from 'ava';
import _app from '.';

test('application', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './demo/demo-working/',
		appID: 101
	});

	t.pass();
});

test('workspace', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './demo/demo-working/',
		appID: 101,
		destination: 'workspace'
	});

	t.pass();
});

test('theme', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './demo/demo-working/',
		appID: 101,
		destination: 'theme'
	});

	t.pass();
});

test('alias', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './demo/demo-working/',
		appID: 'demo'
	});

	t.pass();
});

test('plugin', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
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
			connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
			directory: './demo/demo-empty/',
			appID: 101
		});
	} catch (err) {
		if (err instanceof Error) {
			t.pass();
		}
	}
});

test('invalid-path', t => {
	try {
		_app.publish({
			sqlclPath: 'sql',
			connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
			directory: './demo/demo-invalid/',
			appID: 101
		});
	} catch (err) {
		if (err instanceof Error) {
			t.pass();
		}
	}
});
