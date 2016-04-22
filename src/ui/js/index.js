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

	render: function() {
		var deviceNodes = this.state.devices.map(function(device) {
			return (
				<Device key={device.name}
				        device={device} />
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
		var mode = this.props.device.mode;
		var buttonClass = {
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
							<button type="button" className={buttonClass.off}>Off</button>
						</div>
						<div className="btn-group" role="group">
							<button type="button" className={buttonClass.auto}>Auto</button>
						</div>
						<div className="btn-group" role="group">
							<button type="button" className={buttonClass.on}>On</button>
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
