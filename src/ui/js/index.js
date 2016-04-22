'use strict';

function ajaxUpdateStatus() {
	return $.ajax({
		url: '/api/status',
		type: 'GET',
		dataType: 'json'
	}).fail(function(jqXHR) {
		console.error('unable to get data', jqXHR);
	});
}

function ajaxSetMode(data) {
	return $.ajax({
		url: '/api/mode',
		type: 'PUT',
		dataType: 'json',
		data: data
	}).fail(function(jqXHR) {
		console.error('unable to get data', jqXHR);
	});
}

const DeviceList = React.createClass({
	getInitialState: function() {
		return {
			devices: []
		};
	},

	componentDidMount: function() {
		this.updateStatus();
	},

	updateStatus: function() {
		ajaxUpdateStatus().done((result) => {
			this.setState(result);
		}).always(() => {
			setTimeout(this.updateStatus, 1000);
		});
	},

	setMode: function(deviceIndex, mode) {
		ajaxSetMode({
			deviceIndex: deviceIndex,
			mode: mode
		}).done((result) => {
			this.setState(result);
		});
	},

	render: function() {
		var deviceNodes = this.state.devices.map((device, idx) => {
			return (
				<Device key={idx}
						deviceIndex={idx}
				        device={device}
				        setModeFunc={this.setMode} />
			);
		});

		return (
			<div className="device-list row">
				{deviceNodes}
			</div>
		);
	}
});

const Device = React.createClass({
	render: function() {
		const setModeFunc = this.props.setModeFunc;
		const deviceIndex = this.props.deviceIndex;
		const mode = this.props.device.mode;
		const buttonClass = {
			off: 'btn btn-default',
			auto: 'btn btn-default',
			on: 'btn btn-default'
		};

		buttonClass[mode] += ' active';

		return (
			<div className="col-xs-12 col-lg-4">
				<div className="device">
					<span className={this.props.device.active ? 'active-indicator on' : 'active-indicator'}></span>
					<span className="name">{this.props.device.name}</span>
					<span className="target temp">{this.props.device.setPoint}</span>
					<span className="current temp">{this.props.device.currentTemp}</span>

					<div className="btn-group btn-group-justified btn-group-lg" role="group">
						<div className="btn-group" role="group">
							<button type="button"
							        className={buttonClass.off}
							        onClick={() => setModeFunc(deviceIndex, 'off')}>Off</button>
						</div>
						<div className="btn-group" role="group">
							<button type="button"
							        className={buttonClass.auto}
							        onClick={() => setModeFunc(deviceIndex, 'auto')}>Auto</button>
						</div>
						<div className="btn-group" role="group">
							<button type="button"
							        className={buttonClass.on}
							        onClick={() => setModeFunc(deviceIndex, 'on')}>On</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var devices = [{name: 'one'}, {name: 'two'}];

ReactDOM.render(
	<div className="container-fluid">
		<DeviceList devices={devices} />
	</div>,
	document.getElementById('device-list')
);
