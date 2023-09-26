// SPDX-License-Identifier: MIT 
pragma solidity >=0.5.16;
import "./EllipticCurve.sol";

contract Secp256k1 {

  uint256 public constant GX = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
  uint256 public constant GY = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
  uint256 public constant AA = 0;
  uint256 public constant BB = 7;
  uint256 public constant PP = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;
      
      constructor() public { 
    
    } 

/**
Function: Inverse of a number (mod p)
 */
function invMod(uint256 val, uint256 p) pure public returns (uint256)
{
    return EllipticCurve.invMod(val,p);
}

/**
Function: Modular exponentiation, b^e % _pp.
 */
function expMod(uint256 val, uint256 e, uint256 p) pure public returns (uint256)
{
    return EllipticCurve.expMod(val,e,p);
}

/**
Function: Returns the Y-Coordinate of a point, given the x, and parameters of curve
 */
function getY(uint8 prefix, uint256 x) pure public returns (uint256)
{
    return EllipticCurve.deriveY(prefix,x,AA,BB,PP);
}

/**
Function:; Determines whether a point (x, y) is on the elliptic curve
 */
function onCurve(uint256 x, uint256 y) pure public returns (bool)
{
    return EllipticCurve.isOnCurve(x,y,AA,BB,PP);
}


/**
Function: An x-coordinate can have 2 valid y-coordinates which are inverses (-y) of each other. 
          This function returns teh inverse
 */
function inverse(uint256 x, uint256 y) pure public returns (uint256, 
uint256) {
    return EllipticCurve.ecInv(x,y,PP);
  }


/**
Function: Subtracting 2 points (x1, y1), (x2, y2) on the elliptic and returning a point on the graph.
 */
function subtract(uint256 x1, uint256 y1,uint256 x2, uint256 y2 ) pure public returns (uint256, uint256) {
    return EllipticCurve.ecSub(x1,y1,x2,y2,AA,PP);
  }

/**
Function: Adding 2 points (x1, y1), (x2, y2) on the elliptic and returning a point on the graph.
 */
  function add(uint256 x1, uint256 y1,uint256 x2, uint256 y2 ) pure public returns (uint256, uint256) {
    return EllipticCurve.ecAdd(x1,y1,x2,y2,AA,PP);
  }

/**
Function: Derives the public key give the private key and parameters of elliptic key.
 */
function derivePubKey(uint256 privKey) pure public returns (uint256, uint256) {
    return EllipticCurve.ecMul(privKey,GX,GY,AA,PP);
  }
}