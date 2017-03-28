import test from 'ava';
import publisher from '.';

test('application', t => {
	publisher.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111
	});

	t.pass();
});

test('workspace', t => {
	publisher.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111,
		apexDestination: 'workspace'
	});

	t.pass();
});

test('theme', t => {
	publisher.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111,
		apexDestination: 'theme'
	});

	t.pass();
});
