/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.2
 *
 * @fileoverview
 *  This file includes the definition of ItemPlayer class.
 *
 * @author Young Suk Ahn Park
 * @date 3/05/16
 */


 /**
  * @class PerformanceData
  *
  * @module interactives/player/assignment
  *
  * @classdesc
  *  Data structure that keeps performance data including
  *  - score
  *  - incorrects
  *  - corrects
  *
  */
 export default class PerformanceData
 {
     /**
      * @constructor
      *
      * @param {object} config
      */
     constructor()
     {
         this.score_ = 0;
         this.correctCount_ = 0;
         this.incorrectCount_ = 0;
     }

     getScore()
     {
         return this.score_;
     }

     getStats()
     {
         return {
             corrects: this.correctCount_,
             incorrects: this.incorrectCount_,
             total: this.correctCount_ + this.incorrectCount_
         }
     }

     incrementCorrects()
     {
         return this.correctCount_++;
     }

     incrementIncorrects()
     {
         return this.incorrectCount_++;
     }
}
