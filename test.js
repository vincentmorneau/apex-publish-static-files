import test from 'ava';
import _app from '.';

test('application', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './lib',
		appID: 111
	});

	t.pass();
});

test('workspace', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './lib',
		appID: 111,
		destination: 'workspace'
	});

	t.pass();
});

test('theme', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './lib',
		appID: 111,
		destination: 'theme'
	});

	t.pass();
});

test('alias', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './lib',
		appID: 'webpack'
	});

	t.pass();
});

test('plugin', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'dev/dev@localhost:32122/orclpdb513.localdomain',
		directory: './lib',
		appID: 111,
		destination: 'plugin',
		pluginName: 'ME.VMORNEAU.ANIMAPEX'
	});

	t.pass();
});
