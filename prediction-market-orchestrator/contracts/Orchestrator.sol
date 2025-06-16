// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionOrchestrator is Ownable {
    
    // Events
    event QuestionAsked(bytes32 indexed requestId, address indexed user, string question);
    event ResponseReceived(bytes32 indexed requestId, bytes response);
    
    // State variables
    mapping(bytes32 => address) public requestToUser;
    mapping(bytes32 => string) public requestToQuestion;
    uint256 private requestCounter;
    
    constructor() Ownable(msg.sender) {}

    // Chainlink Functions yapılandırması
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    
    uint64 private subscriptionId;
    uint32 private gasLimit = 300000;
    bytes32 private donID;
    
    // State değişkenleri
    mapping(bytes32 => string) public requests;
    mapping(bytes32 => address) public requestInitiators;
    
    // Events
    event QuestionAsked(bytes32 indexed requestId, string question, address initiator);
    event ResponseReceived(bytes32 indexed requestId, bytes response);
    event TradeExecuted(address indexed market, uint256 outcome, uint256 amount);
    
    constructor(
        address router,
        uint64 _subscriptionId,
        bytes32 _donID
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        subscriptionId = _subscriptionId;
        donID = _donID;
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param question The question to analyze
     * @param args Arguments for the HTTP request
     * @return requestId The ID of the request
     */
    function askQuestion(
        string memory question,
        string[] memory args
    ) external returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(
            "const question = args[0];"
            "const apiResponse = await fetch(`https://api.example.com/data?q=${question}`);"
            "const data = await apiResponse.json();"
            "return Functions.encodeString(JSON.stringify(data));"
        );
        
        if (args.length > 0) req.setArgs(args);
        
        // Send the request and store the request ID
        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        
        s_lastRequestId = requestId;
        requests[requestId] = question;
        requestInitiators[requestId] = msg.sender;
        
        emit QuestionAsked(requestId, question, msg.sender);
        
        return requestId;
    }

    /**
     * @notice Callback function for fulfilling the request
     * @param requestId The ID of the request
     * @param response The HTTP response data
     * @param err Any errors from the HTTP request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert("request ID is incorrect");
        }
        
        s_lastResponse = response;
        s_lastError = err;
        
        emit ResponseReceived(requestId, response);
    }

    /**
     * @notice Execute trade on prediction market
     * @param marketAddress Address of the prediction market
     * @param outcomeIndex Index of the outcome to bet on
     * @param amount Amount to bet
     */
    function executeTrade(
        address marketAddress,
        uint256 outcomeIndex,
        uint256 amount
    ) external onlyOwner {
        // Burada gerçek prediction market kontratı ile etkileşim
        // Şimdilik basit bir event emit ediyoruz
        emit TradeExecuted(marketAddress, outcomeIndex, amount);
        
        // TODO: Gerçek market kontratı ile etkileşim
        // IPredictionMarket(marketAddress).placeBet(outcomeIndex, amount);
    }

    /**
     * @notice Get the latest response
     */
    function getLatestResponse() external view returns (bytes memory) {
        return s_lastResponse;
    }
}