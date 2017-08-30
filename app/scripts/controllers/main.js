'use strict';

/**
 * @ngdoc function
 * @name rpcExplorerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rpcExplorerApp
 */
angular.module('rpcExplorerApp')
    .controller('MainCtrl', function ($scope, $routeParams, $http, SrvUtil, SrvChain, SrvBackend) {

        $scope.CTverbose = false;
        $scope.verbose = false;
        $scope.rawhex_limit = 100;
        $scope.selected_chain = SrvChain.get();
        $scope.available_chains = [$scope.selected_chain];

        function cleanTx() {
            $scope.txid = "";
            $scope.transaction = null;
            $scope.txjson = null;
        }

        function cleanBlock() {
            $scope.blockid = "";
            $scope.blockheight = null;
            $scope.block = null;
            $scope.blockjson = null;
        }

        function successAvailableChains(data) {
            $scope.available_chains = data["data"]["available_chains"];
            $scope.available_chains.push("forbiddenchain");
        }

        $scope.searchBlock = function() {
            
            function statsCallbackBlock(data) {
                $scope.blockstats = data["data"]["result"];
            };

            function successCallbackBlock(data) {
                $scope.block = data["data"]["result"];
                $scope.blockheight = $scope.block["height"];
                var params = {
                    "start": $scope.block["height"],
                    "end": $scope.block["height"],
                };
                SrvBackend.rpcCall("getblockstats", params, statsCallbackBlock, SrvUtil.errorCallbackScoped($scope));
                $scope.blockjson = JSON.stringify($scope.block, null, 4);
            };
            SrvBackend.get("block", $scope.blockid, successCallbackBlock, SrvUtil.errorCallbackScoped($scope));

        };

        $scope.searchBlockByHeight = function() {
            function successCallbackBlockHeight(data) {
                $scope.blockid = data["data"]["result"];
                $scope.searchBlock();
            };
            cleanTx();
            var params = {"height": $scope.blockheight};
            SrvBackend.rpcCall("getblockhash", params, successCallbackBlockHeight, SrvUtil.errorCallbackScoped($scope));
        };

        $scope.searchTx = function() {
            function successCallbackTx(data) {
                $scope.showtxlist = false;
                $scope.transaction = data["data"]["result"];
                $scope.blockid = $scope.transaction["blockhash"];
                $scope.searchBlock();
                $scope.txjson = JSON.stringify($scope.transaction, null, 4);
            };
            cleanBlock();
            SrvBackend.get("tx", $scope.txid, successCallbackTx, SrvUtil.errorCallbackScoped($scope));
        };

        $scope.goToBlock = function(blockhash) {
            $scope.blockid = blockhash;
            $scope.searchBlock();
            cleanTx();
        };

        $scope.goToTx = function(txhash) {
            $scope.txid = txhash;
            $scope.searchTx();
        };

        $scope.IsCTOut = function(output) {
            return !output["value"] && output["value"] != 0;
        };

        function initCallback(data) {
            $scope.chaininfo = data["data"]["result"];
        };
        $scope.InitForSelectedChain = function() {
            SrvChain.set($scope.selected_chain);
            cleanTx();
            cleanBlock();
            SrvBackend.rpcCall("getblockchaininfo", {}, initCallback, SrvUtil.errorCallbackScoped($scope));
        };

        SrvBackend.GetAvailableChains(successAvailableChains, SrvUtil.errorCallbackScoped($scope));
        // Init from $routeParams
        if ($routeParams.chain) {
            $scope.selected_chain = $routeParams.chain;
        }
        $scope.InitForSelectedChain();

        if ($routeParams.block) {
            $scope.goToBlock($routeParams.block);
        } else if ($routeParams.txid) {
            $scope.goToTx($routeParams.txid);
        }
    });
