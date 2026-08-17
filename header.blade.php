
@php

    /*$info = $common_content['info'] ;
    $socials = $common_content['socials'] ;
    $social_true = (!$socials) ? false : true ;
    $info_true = (!$info) ? false : true ;*/

    /*if($info_true){

        $head_mail = $info['email'] ;
        $head_fone = "+91-".$info['mobile_no'] ;
        $logo = "assets/ecomm/logos/".$info['logo'] ;

    }else{

        $head_mail = 'example@gamil.com' ;
        $head_fone = "+91-9876543210";
        $logo =  'assets/ecomm/logos/no_logo.png';

    }*/

@endphp 

<!-- Topbar Start -->

<div class="container-fluid">
   {{-- - <div class="row bg-primary top_head_bar">
        <div class="col-lg-6 d-none d-lg-block py-2 px-xl-5">
            <div class="d-inline-flex align-items-center">
				<a class="text-dark" href="mailto:{{ $head_mail }}" target="_blank">
					{{ strtolower($head_mail)}}
				</a>
                <span class="text-muted px-2">|</span>
                {{--<a class="text-dark" href="https://wa.me/{{ $head_fone }}"  target="_blank">{{ $head_fone }}</a>--
                <a class="text-dark" href="https://web.whatsapp.com/send?phone={{ $head_fone }}"  target="_blank">{{ $head_fone }}</a>

            </div>
        </div>

        <div class="col-lg-6 text-center text-lg-right d-lg-block d-none py-2 px-xl-5">
            <div class="d-inline-flex align-items-center">
                @if(!$social_true)
                    <a class="text-dark px-2" href="#">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a class="text-dark px-2" href="#">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a class="text-dark px-2" href="#">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a class="text-dark px-2" href="#">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a class="text-dark pl-2" href="#">
                        <i class="fab fa-youtube"></i>
                    </a>
                @else
                    @php
                        $head_social_common = $socials->toArray() ;
                    @endphp
                    @if(!empty($head_social_common))
                        @foreach($head_social_common as $si=>$social)
                        <a class="text-dark px-2" href="{{ $social['social_link']}}" target="_blank">
                            <i class="{{ $social['social_icon_src'] }}"></i>
                        </a>
                        @endforeach
                    @endif

                @endif

            </div>
        </div>
    </div>--}}

    <div class="row align-items-center py-lg-3 px-xl-5 bg-transparent" id="head_search_bar">
        <div class="col-lg-3 d-none d-lg-block">
            <a href="" class="text-decoration-none">
                <img src="{{ asset("$logo")}}" class="img-responsive logo_image" width="160" height="60" alt="{{ $web_title ?? 'Logo' }}">
            </a>
        </div>




        <div class="col-l`g-6 col-12 text-left d-none d-lg-block">
            <form action="{{ url("{$ecommbaseurl}shop") }}" method="post">
                <div class="input-group minimul" id="top-search-field">
                    @csrf
                    <input type="text" class="form-control" name="search_term" placeholder="Search for products">
                    <div class="input-group-append">
                        <span class="input-group-text bg-inherit text-primary p-0 border-0">
                            <button type="submit" id="btn-top-search" class="btn btn-sm" name="search">
                                <i class="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                </div>
            </form>
        </div>


        <div class="col-lg-3 col-12 text-right mt-2 d-lg-block d-none">
            <ul style="display:inline-flex;list-style:none;padding:0;margin:0;" id="head_shop_list">
                <li>
                    <a href="{{ url("{$ecommbaseurl}wishlist") }}" class="card-wish">
                        <i class="fas fa-heart text-primary"></i>
                        <span class="badge" id="wishlist_count">0</span>
                    </a>
                </li>
                <li >
                    <a href="{{ url("{$ecommbaseurl}cart") }}" class="card-wish">
                        <i class="fas fa-shopping-cart text-primary"></i>
                        <span class="badge" id="kart_count">0</span>
                    </a>
                </li>
                
                @if(Auth::guard('custo')->check())
                <li>
                    <a href="#custo_menu_sub" class="border card-wish" id="custo_main"><i class="fa fa-user"></i> 
                    <span class="fa fa-angle-down"></span></a>
                    <ul id="custo_menu_sub">
                        <li><a href="{{ url("{$ecommbaseurl}profile")}}"><i class="fa fa-user"></i> Profile</a></li>
                        <li><a href="{{ url("{$ecommbaseurl}password")}}"><i class="fa fa-lock"></i> Password</a></li>
                        <hr>
                        <hr class="d-block d-lg-none">
                        <li><a href="{{ url("{$ecommbaseurl}logout") }}"><i class="fa fa-share-square"></i> Logout</a></li>
                    </ul>
                </li>
                @endif
            </ul>
        </div>
    </div>
</div>

<!-- Topbar End -->

<!-- Navbar Start -->
<div class="container-fluid" id="top_menu_bar_container">
    <div class="row border-top px-xl-5 top_header">
        <div class="col-lg-3 d-none d-lg-block">
            <a class="btn btn-menu shadow d-flex align-items-center justify-content-between bg-primary text-white w-100"
                data-toggle="collapse" href="#navbar-vertical" style="margin-top: -1px; padding: 0 30px;">
                <h6 class="m-0">Categories</h6>
                <i class="fa fa-angle-down text-dark"></i>
            </a>
            {{-- -<nav class="<?= (@$index) ? 'show shadow' : ''; ?> collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light category_dropdown"
                id="navbar-vertical" style="">--}}

            <nav class="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light category_dropdown"  id="navbar-vertical" style="">
                <div class="navbar-nav w-100 " style="">
                    <div class="nav-item dropdown">
                        @if(count($collection) > 0)
                        <a href="#" class="nav-link" data-toggle="dropdown">Collection <i
                                class="fa fa-angle-down float-right mt-1"></i></a>
                        <div class="dropdown-menu position-absolute bg-default border-0 rounded-0 w-100 m-0" style="box-shadow: 1px -2px 3px 1px">
                            @foreach($collection as $collkey=>$collmenu)
                            <a href="{{ url("{$ecommbaseurl}shop/{$collmenu->slug}")}}" class="dropdown-item">{{ $collmenu->name}}</a>
                            @endforeach
                        </div>
                        @endif
                    </div>
                    @foreach($main_menu as $main=>$menu)
                    <a href="{{ url("{$ecommbaseurl}shop/{$menu->slug}")}}" class="nav-item nav-link">{{ $menu->name }}</a>
                    @endforeach
                </div>
            </nav>
        </div>
        <div class="col-lg-9">
            <nav class="navbar navbar-expand-lg bg-light navbar-light py-0 px-0 top_menue_bar">
				
                <!--Mobile Menu Call Three Dot Button--->
               <!-- <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse" >
                    <i class="fas fa-bars"></i>
                </button>-->

                <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
                    <i class="fas fa-bars"></i>
                </button>

                <a href="{{$ecommbaseurl}}" class="text-decoration-none d-block d-lg-none">
                    <img src="{{ asset($logo) }}" class="img-responsive logo_image" width="120" height="40" alt="{{ $web_title ?? 'Logo' }}">
                </a>
                @if(Auth::guard('custo')->check())
                <ul style="display:inline-flex;list-style:none;padding:0;" class="d-lg-none">
                    <li id="mob_search_btn"><a href="#mob_search_bar" onclick="event.preventDefault();$($(this).attr('href')).toggleClass('mob_appear mob_disappear')"><i class="fa fa-search"></i></a></li>
                    <li>
                        <a href="#mob_custo_menu_sub" class="" id="mob_custo_main"><i class="fa fa-user"></i> 
                        <span class="fa fa-angle-down"></span></a>
                        <ul id="mob_custo_menu_sub">
                            <li class="d-lg-none"><a href="{{ url("{$ecommbaseurl}dashboard") }}"><i class="fa fa-tachometer-alt"></i> Dashboard</a></li>
                            <li><a href="{{ url("{$ecommbaseurl}profile")}}"><i class="fa fa-user"></i> Profile</a></li>
                            <li><a href="{{ url("{$ecommbaseurl}cart")}}"><i class="fa fa-shopping-cart"></i> Cart</a></li>
                            <li><a href="{{ url("{$ecommbaseurl}wishlist")}}"><i class="fa fa-heart"></i> WishList</a></li>
							 <li class="d-lg-none"><a href="{{ url("{$ecommbaseurl}enquiries")}}"><i class="fas fa-paper-plane"></i> Enquiry</a></li>
                            <hr> 
							<li class="d-lg-none"><a href="{{ url("{$ecommbaseurl}schemes")}}"><i class="fas fa-bookmark"></i> Schemes</a></li> 							
                            <li class="d-lg-none"><a href="{{ url("{$ecommbaseurl}orders")}}"><i class="fas fa-bookmark"></i> Orders</a></li>
                            <li class="d-lg-none"><a href="{{ url("{$ecommbaseurl}transactions")}}"><i class="fa fa-briefcase"></i> Transactions</a></li>
                            <hr>
                            <li><a href="{{ url("{$ecommbaseurl}password")}}"><i class="fa fa-lock"></i> Password</a></li>
                            <hr class="d-lg-none">
                            <li><a href="{{ url("{$ecommbaseurl}logout") }}"><i class="fa fa-share-square"></i> Logout</a></li>
                        </ul>
                    </li>
                </ul>
				@else 
					<ul style="display:inline-flex;list-style:none;padding:0;" id="head_shop_list" class="mbl d-lg-none m-0">
                        <li id="mob_search_btn"><a href="#mob_search_bar" onclick="event.preventDefault();$($(this).attr('href')).toggleClass('mob_appear mob_disappear')"><i class="fa fa-search"></i></a></li>
						<li>
							<a href="https://mgjewellers.com/wishlist" class="card-wish card-wish-mbl">
								<i class="fas fa-heart text-primary"></i>
								<span class="badge" id="wishlist_count">0</span>
							</a>
						</li>
						<li>
							<a href="https://mgjewellers.com/cart" class="card-wish card-wish-mbl">
								<i class="fas fa-shopping-cart text-primary"></i>
								<span class="badge" id="kart_count">0</span>
							</a>
						</li>
                
					</ul>
                @endif
                <div class="col-12 text-left d-lg-none mob_disappear py-1 px-0" id="mob_search_bar" >
                    <form action="{{ url("{$ecommbaseurl}shop") }}" method="post">
                        <div class="input-group" id="top-search-field">
						@csrf
                            <input type="text" class="form-control" placeholder="Search for products" name="mob_search_term">
                            <div class="input-group-append">
                                <span class="input-group-text  text-primary p-0">
									<button type="submit" id="btn-top-search" class="" name="search" > 
										<i class="fa fa-search"></i>
									</button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                @php
                    $$activemenu = 'active';
            
                @endphp
                       <!--------test code ---->
                       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<nav class="mobile-menu" id="mobileMenu" aria-hidden="true" role="navigation">
    <button class="menu-close" id="menuClose" aria-label="Close menu">✕</button>
    <ul class="menu-list">
        <li>
            <a href="{{ url("{$ecommbaseurl}") }}" class="{{ @$index }}">
                <i class="fa fa-home"></i> <span>Home</span>
            </a>
        </li>
        <li>
            <a href="{{ url("{$ecommbaseurl}about") }}" class="{{ @$about }}">
                <i class="fa fa-info-circle"></i> <span>About</span>
            </a>
        </li>
        <li>
            <a href="{{ url("{$ecommbaseurl}scheme") }}" class="{{ @$scheme}}">
                <i class="fa fa-gift"></i> <span>Scheme</span>
            </a>
        </li>
        <li>
            <a href="{{ url("{$ecommbaseurl}shop") }}" class="{{ @$shop }}">
                <i class="fa fa-shopping-cart"></i> <span>Online Shop</span>
            </a>
        </li>
        <li>
            <a href="{{ url("{$ecommbaseurl}cateloge") }}" class="{{ @$cateloge }}">
                <i class="fa fa-book"></i> <span>Catalogue</span>
            </a>
        </li>
        <li>
            <a href="{{ url("{$ecommbaseurl}contact") }}" class="{{ @$contact }}">
                <i class="fa fa-envelope"></i> <span>Contact</span>
            </a>
        </li>
        <li>
            <a href="{{ url("{$ecommbaseurl}shop-location") }}" class="@{{ @$shop_location }}">
                <i class="fa fa-location-arrow"></i> <span>Shop Location</span>
            </a>
        </li>

                                
                                  
                                       
                  {{-- -testing  code Categories --}}  
                  <!-- Category Section -->
<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle mob_cat" href="#" data-toggle="collapse" data-target="#mobileCategories" >
    Categories <i class="fa fa-angle-down float-right mt-1"></i>
  </a>
  <div class="collapse" id="mobileCategories">
    <div class="navbar-nav w-100 overflow-hidden" style="max-height: 410px;">
      
      <div class="nav-item dropdown">
        @if(count($collection) > 0)
          <a href="#" class="nav-link" data-toggle="dropdown">
            Collection <i class="fa fa-angle-down float-right mt-1"></i>
          </a>
          <div class="dropdown-menu position-static border-0 rounded-0 w-100 m-0">
            @foreach($collection as $collkey=>$collmenu)
              <a href="{{ url("{$ecommbaseurl}shop{$collmenu->slug}")}}" class="dropdown-item">{{ $collmenu->name}}</a>
            @endforeach
          </div>
        @endif
      </div>

      @foreach($main_menu as $main=>$menu)
        <a href="{{ url("{$ecommbaseurl}shop/{$menu->slug}")}}" class="nav-item nav-link">{{ $menu->name }}</a>
      @endforeach

    </div>
  </div>
</li>
                


                                @if(!Auth::guard('custo')->check())
                                    <ul class="d-lg-none text-center row p-0" style="list-style:none;" id="mob_user_sign">
                                        <li class="col-12"><hr></li>

                                        <li class="col-6 px-1">
                                        <a href="{{ url("{$ecommbaseurl}login") }}" class="btn btn-secondary col-12 {{ @$login }}">
                                            <i class="fa fa-sign-in-alt"></i> Login
                                        </a>
                                        </li>

                                        <li class="col-6 px-1">
                                        <a href="{{ url("{$ecommbaseurl}register") }}" class="btn btn-secondary col-12 {{ @$register }}">
                                            <i class="fa fa-user-plus"></i> Register
                                        </a>
                                        </li>

                                    </ul> 
                                 @endif
                                </ul>
                        </nav>

                        <div class="menu-backdrop" id="menuBackdrop" tabindex="-1" aria-hidden="true"></div>



                <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                    <!--Mobile Main Menu-->
                    <div class="navbar-nav mr-auto py-0">
                        <a href="{{ url("{$ecommbaseurl}") }}" class="nav-item nav-link {{ @$index }}">Home</a>
                        <a href="{{ url("{$ecommbaseurl}about") }}" class="nav-item nav-link {{ @$about }}">About</a>
                        <a href="{{ url("{$ecommbaseurl}scheme") }}" class="nav-item nav-link {{ @$scheme}}">Scheme</a>
                        <a href="{{ url("{$ecommbaseurl}shop") }}" class="nav-item nav-link {{ @$shop }}">Online Shop</a>
						<a href="{{ url("{$ecommbaseurl}cateloge") }}" class="nav-item nav-link {{ @$cateloge }}">Catalogue</a>
                        <!-- <a href="detail.php" class="nav-item nav-link">Shop Detail</a> -->

                        {{-- @if($branches)
                            <div class="nav-item dropdown">
                                <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Branched</a>
                                <div class="dropdown-menu rounded-0 m-0">
                                    @foreach($branches as $key => $branch)
                                        <a href="{{ url($branch->branch_name)}}"
                                            class="dropdown-item">{{ $branch->branch_name . (($branch->vndr_parent == 0) ? "( Main )" : "")}}</a>
                                    @endforeach
                                </div>
                            </div>
                        @endif --}}

                        <a href="{{ url("{$ecommbaseurl}contact") }}"
                            class="nav-item nav-link {{ @$contact }}">Contact</a>

                        <a href="{{ url("{$ecommbaseurl}shop-location") }}" class="nav-item nav-link @{{  @$shop_location }}"> Shop Location </a>

                    </div>

                    <div class="navbar-nav ml-auto py-0">
                        
                        @if(Auth::guard('custo')->check())
                        <a href="{{ url("{$ecommbaseurl}dashboard") }}" class="nav-item nav-link d-md-block d-none {{ @$dashboard }}"><i class="fa fa-tachometer-alt"></i> Dashboard</a>  
                        <a href="{{ url("{$ecommbaseurl}logout") }}" class="nav-item nav-link d-md-block d-none {{ @$logout }}"><i class="fa fa-share-square"></i> Logout</a>
                        @else
						<ul class="d-lg-none text-center row p-0" style="list-style:none;">
							<li class="col-12"><hr></li>
							<li class="col-6"><a href="{{ url("{$ecommbaseurl}login") }}" class="btn btn-secondary col-12 {{ @$login }}">Login</a></li>
							<li class="col-6"><a href="{{ url("{$ecommbaseurl}register") }}" class="btn btn-secondary col-12 {{ @$register }}">Register</a></li>
						</ul>
                      <a href="{{ url("{$ecommbaseurl}login") }}" class="nav-item nav-link d-none d-lg-block {{ @$login }}">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </a>
                        <a href="{{ url("{$ecommbaseurl}register") }}" class="nav-item nav-link d-none d-lg-block {{ @$register }}">
                            <i class="fas fa-user-plus"></i> Register
                        </a>


                        @endif
                    </div>
                </div>
            </nav>

        </div>
        {{-- -<div class="col-lg-3 d-lg-block d-none">
            <a class="btn shadow d-flex align-items-center justify-content-between bg-primary text-white w-100 category_drop_btn_mob"
                data-toggle="collapse" href="#navbar-vertical" style="height: 65px; margin-top: -1px; padding: 0 30px;">
                <h6 class="m-0">Categories</h6>
                <i class="fa fa-angle-down text-dark"></i>
            </a>
            <nav class="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light category_dropdown category_dropdown_mob"
                id="navbar-vertical" style="width: calc(100% - 30px); z-index: 1;">
                <div class="navbar-nav w-100 overflow-hidden" style="height: 410px">
                    <div class="nav-item dropdown">
                    @if(count($collection) > 0)
                        <a href="#" class="nav-link" data-toggle="dropdown">Collection <i
                                class="fa fa-angle-down float-right mt-1"></i></a>
                        <div class="dropdown-menu position-absolute border-0 rounded-0 w-100 m-0">
                            @foreach($collection as $collkey=>$collmenu)
                            <a href="{{ url("{$ecommbaseurl}shop{$collmenu->slug}")}}" class="dropdown-item">{{ $collmenu->name}}</a>
                            @endforeach
                        </div>
                        @endif
                    </div>
                    @foreach($main_menu as $main=>$menu)
                    <a href="{{ url("{$ecommbaseurl}shop/{$menu->slug}")}}" class="nav-item nav-link">{{ $menu->name }}</a>
                    @endforeach
                    
                </div>
            </nav>
        </div>--}}
    </div>
	<div id="header_seprator" class="container-fluid">
	</div>
    <?php if (@$index) { ?>
		@php $default_slides = false; @endphp  
    <!--<div class="row px-xl-5">
       <div class="col-md-3">
        </div>-
        <div class="col-md-9"></div>-->
        <div class="row"></div>
        <div class="col-md-12">
            <div id="header-carousel" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
					@if(!$default_slides && $sliders->count()>0)
						@foreach($sliders as $sldk=>$slide)
						
							<div class="carousel-item {{ ($sldk==0)?'active':'' }}">
								<img class="img-fluid" src="{{ asset("{$slide->slider_image}")}}" alt="{{ $slide->slider_top_text??"Slide {$sldk}" }}" width="1920" height="1080" {{ $sldk > 0 ? 'loading=lazy' : 'fetchpriority=high' }}>
								<div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
									<div class="p-3" style="max-width: 700px;">
										@if(!empty($slide->slider_top_text))
											<h4 class="text-light text-uppercase font-weight-medium mb-3">{{ $slide->slider_top_text }}</h4>
										@endif
										@if(!empty($slide->slider_bottom_text))
											<h3 class="display-4 text-white font-weight-semi-bold mb-4">{{ $slide->slider_bottom_text }}</h3>
										@endif
										<a href="" class="btn btn-light py-2 px-3">Shop Now</a>
									</div>
								</div>
							</div>
						@endforeach
					@else 
                    <div class="carousel-item active">
                        <img class="img-fluid" src="{{ asset('assets/ecomm/images/slider/slide_1.webp')}}" alt="Slide 1" width="1920" height="1080" fetchpriority="high">
                        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <div class="p-3" style="max-width: 700px;">
                                <h4 class="text-light text-uppercase font-weight-medium mb-3">Keep This Secret</h4>
                                <h3 class="display-4 text-white font-weight-semi-bold mb-4">You are more Beautifull</h3>
                                <a href="" class="btn btn-light py-2 px-3">Shop Now</a>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img class="img-fluid" src="{{ asset('assets/ecomm/images/slider/slide_2.webp')}}" alt="Slide 2" width="1920" height="1080" loading="lazy">
                        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <div class="p-3" style="max-width: 700px;">
                                <h4 class="text-light text-uppercase font-weight-medium mb-3">How You Looks</h4>
                                <h3 class="display-4 text-white font-weight-semi-bold mb-4">Beauty Enhancement</h3>
                                <a href="" class="btn btn-light py-2 px-3">Shop Now</a>
                            </div>
                        </div>
                    </div>
					@endif
                </div>
                <a class="carousel-control-prev" href="#header-carousel" data-slide="prev">
                    <div class="btn btn-dark" style="width: 45px; height: 45px;align-content: center;">
                        <span class="carousel-control-prev-icon mb-n2">&#10094;</span>
                    </div>
                </a>
                <a class="carousel-control-next" href="#header-carousel" data-slide="next">
                    <div class="btn btn-dark" style="width: 45px; height: 45px;align-content: center;">
                        <span class="carousel-control-next-icon mb-n2" style="color:white;">&#10095;</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <?php } ?>
	
</div>

<!-- Navbar End -->

