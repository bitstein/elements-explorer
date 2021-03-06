'use strict';

/**
 * @ngdoc function
 * @name rpcExplorerApp.controller:MempoolStatsCtrl
 * @description
 * # MempoolStatsCtrl
 * Controller of the rpcExplorerApp
 */
angular.module('rpcExplorerApp')
    .controller('MempoolStatsCtrl', function ($scope, $routeParams, $location, SrvUtil, SrvChain, SrvBackend) {

        SrvChain.set($routeParams.chain);

        $scope.curious = $location.search().curious == 'true';
        $scope.hours_ago = SrvUtil.ParseNatural($location.search().hours_ago);
        $scope.loading_stats = false;
        $scope.cached_mempoolstats = {};

        $scope.stats_types = ['count', 'fee', 'vsize'];
        $scope.sel_stats_type = $scope.stats_types[0];

        $scope.valid_stats = [
            '1', '2', '3', '4', '5',
            '10', '15', '20', '25', '30',
            '40', '50', '60', '70', '80', '90',
            '100', '120', '140', '160', '180',
            '200', '250', '300', '350', '400', '450',
            '500', '600', '700', '800', '900',
            '1000', '1500', '2000',
            'total'
        ];

        $scope.selected_stats = [
            '1',
            '10', '20', '30', '50', '70',
            '100', '120', '200', '300', '500', '700',
            'total'];

        function CreateTrace(key, xaxis_data, yaxis_data)
        {
            return {
                name: key,
                x: xaxis_data,
                y: yaxis_data,
                fill: 'tonexty',
                type: 'scatter'
            };
        }

        function CalculatePlotData(stats_type, valid_stats, data)
        {
            var plot_data = {};

            for (var i = 0; i < valid_stats.length; i++) {

                var val_stat = valid_stats[i];
                var xaxis_data = [];
                var yaxis_data = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        xaxis_data.push(new Date(parseInt(key) * 1000));
                        yaxis_data.push(data[key][stats_type][val_stat]);
                    }
                }
                plot_data[val_stat] = {'x': xaxis_data, 'y': yaxis_data};
            }
            return plot_data;
        }

        var GetPlotData = function(stats_types, valid_stats, data) {

            var plot_data = {};
            for (var i = 0; i < stats_types.length; i++) {
                plot_data[i] = CalculatePlotData(stats_types[i], valid_stats, data);
            }
            return plot_data;
        };

        function StatsToGraph(selected_stats, plot_data)
        {
            var graph_list = [];

            for (var i = 0; i < selected_stats.length; i++) {
                var sel_stat = selected_stats[i];
                graph_list.push(CreateTrace(sel_stat, plot_data[sel_stat]['x'], plot_data[sel_stat]['y']));
            }
            return graph_list;
        };

        function CachePlotData(_data)
        {
            var data = _data['data'];
            $scope.plot_data = GetPlotData($scope.stats_types, $scope.valid_stats, data);
        }

        function PlotCachedData()
        {
            $scope.cached_mempoolstats = {};
            for (var i = 0; i < $scope.stats_types.length; i++) {
                $scope.cached_mempoolstats[$scope.stats_types[i]] = StatsToGraph($scope.selected_stats, $scope.plot_data[i]);
            }

            $scope.graphPlots = $scope.cached_mempoolstats[$scope.sel_stats_type];

            $scope.loading_stats = false;
        };

        $scope.doPlot = function() {
            $scope.loading_stats = true;

            if ($scope.plot_data && $scope.hours_ago == $scope.cached_hours_ago) {
                PlotCachedData();
            } else {
                $scope.cached_hours_ago = $scope.hours_ago;
                SrvBackend.RpcCall('mempoolstats', {'hours_ago': $scope.hours_ago })
                    .then(CachePlotData)
                    .then(PlotCachedData)
                    .catch(SrvUtil.errorCallbackScoped($scope));
            }
            $location.search('hours_ago', $scope.hours_ago);
        };

        $scope.doPlot();

        $scope.toggleStat = function(name) {
            var idx = $scope.selected_stats.indexOf(name);

            if (idx > -1) {
                // Is currently selected
                $scope.selected_stats.splice(idx, 1);
            } else {
                // Is newly selected
                $scope.selected_stats.push(name);
            }

            var aux_sel_stats = [];
            for (var i = 0; i < $scope.valid_stats.length; i++) {
                var val_stat = $scope.valid_stats[i];
                if ($scope.selected_stats.indexOf(val_stat) > -1) {
                    aux_sel_stats.push(val_stat);
                }
            }
            $scope.selected_stats = aux_sel_stats;

            $scope.doPlot();
        };

        $scope.changeStatType = function(name) {
            $scope.loading_stats = true;

            if ($scope.stats_types.indexOf(name) > -1) {
                $scope.sel_stats_type = name;
            }
            $scope.graphPlots = $scope.cached_mempoolstats[$scope.sel_stats_type];

            $scope.loading_stats = false;
        };

    });
