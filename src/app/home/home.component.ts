import { Component, OnInit, Inject } from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { Promotion } from "../shared/promotion";
import { PromotionService } from "../services/promotion.service";
import { Leader } from "../shared/leader";
import { LeaderService } from "../services/leader.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(
    private promotionService: PromotionService,
    private dishService: DishService,
    private leaderService: LeaderService,
    @Inject("BaseURL") private BaseURL
  ) {}

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe(
      dish => {
        this.dish = dish;
      },
      errMess => (this.dishErrMess = errMess)
    );
    this.promotionService.getFeaturedPromotion().subscribe(
      promotion => {
        this.promotion = promotion;
      },
      errMess => (this.promotionErrMess = errMess)
    );
    this.leaderService.getFeaturedLeader().subscribe(
      leader => {
        this.leader = leader;
      },
      errMess => (this.leaderErrMess = errMess)
    );
  }
}
