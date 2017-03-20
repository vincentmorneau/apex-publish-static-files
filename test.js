import test from 'ava';
import publisher from '.';

test('publisher', t => {
	publisher.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: './lib',
		appID: 111
	});

	t.pass();
});
