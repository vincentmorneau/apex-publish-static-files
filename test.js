import test from 'ava';
import _app from '.';

test('application', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111
	});

	t.pass();
});

test('workspace', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111,
		apexDestination: 'workspace'
	});

	t.pass();
});

test('theme', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111,
		apexDestination: 'theme'
	});

	t.pass();
});

test('alias', t => {
	_app.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 'webpack'
	});

	t.pass();
});
