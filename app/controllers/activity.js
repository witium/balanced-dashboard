Balanced.ActivityController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, Balanced.TransactionsTable, {
	needs: ['marketplace'],

	type: 'activity',

	sortField: 'created_at',
	sortOrder: 'desc',
	limit: 50,

	baseClassSelector: '#activity',
	noDownloadsUri: true,

	transactionStatus: 'all',

	actions: {
		openPaySellerModal: function() {
			this.trigger('openPaySellerModal');
		},

		openChargeCardModal: function() {
			this.trigger('openChargeCardModal');
		},

		changeTypeFilter: function(type) {
			this._super(type);

			if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
				this.transitionToRoute('activity.transactions');
			} else if (type === 'order') {
				this.transitionToRoute('activity.orders');
			}
		},

		openAddFundsModal: function() {
			this.trigger('openAddFundsModal');
		},

		openWithdrawFundsModal: function() {
			this.trigger('openWithdrawFundsModal');
		}
	},

	extra_filtering_params: function() {
		var transactionStatus = this.get('transactionStatus');
		var type = this.get('type');

		if (type !== 'transaction' && !_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return {};
		}

		if (transactionStatus === 'all') {
			return {
				'status[in]': 'failed,succeeded,pending'
			};
		}

		return {
			status: transactionStatus
		};
	}.property('type', 'transactionStatus'),

	results_base_uri: function() {
		var type = this.get('type');

		if (type === 'dispute') {
			return '/disputes';
		} else if (_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return '/transactions';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
});

Balanced.ActivityTransactionsController = Balanced.ActivityController.extend({
	needs: ['marketplace', 'activity'],
	baseClassSelector: '#transactions',
	type: 'transaction',
	pageTitle: 'Transactions',
	noDownloadsUri: true
});

Balanced.ActivityOrdersController = Balanced.ActivityController.extend({
	needs: ['marketplace', 'activity'],
	baseClassSelector: '#orders',
	type: 'order',
	pageTitle: 'Orders'
});
