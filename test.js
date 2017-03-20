import test from 'ava';
import publisher from '.';

test('publisher', t => {
	publisher.publish({
		sqlclPath: 'sql',
		connectString: 'OOS_USER/oracle@localhost:50521/xe',
		directory: 'C:\\Users\\vince\\Google Drive\\Dropbox\\GitHub\\afeb-demo\\dist',
		appID: 111
	});

	t.pass();
});
