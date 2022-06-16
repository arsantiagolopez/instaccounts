"""Instagram Algorithm Restrictions"""
# below 100 interactions per 1 hour, below 700 interactions per 24 hours
# likes per hour: 60 likes
# relationships per hour (follow & unfollows): 60 total
# sleep 3-4 times between operating times

# imports
from instapy import InstaPy
from instapy import smart_run
import random
import time
from datetime import date

# get an InstaPy session!
session = InstaPy()

############################################################
########### Preferences programatically updated ############
############################################################

# Hashtags to interact with
hashtags = ['adinross']

# Competitors whose followers you want to interact with
competitors = ['adinross']

# Locations you want to interact with
locations = []

############################################################
############################################################
############################################################

# Get session & preferences
def get_session():

    # Start Instapy with passed down credentials
	session = InstaPy(want_check_browser=False)

	"""Global settings"""
	# Skip specific users
	session.set_skip_users(skip_private=False,
					private_percentage=100,
					skip_no_profile_pic=True,
					no_profile_pic_percentage=100,
					skip_business=False,
					business_percentage=100,
					skip_business_categories=[],
					dont_skip_business_categories=[])

	# Set relationship bounds (min posts, etc) (positive potency ratio means followers of user is higher than following)
	session.set_relationship_bounds(enabled=True,
					potency_ratio=-0.5, # -0.5 by recommendation
					delimit_by_numbers=True,
					max_followers=5000,
					max_following=2000,
					min_followers=30,
					min_following=30,
					min_posts=5,
					max_posts=5000)

	# Ignore users (competitors)
	session.set_ignore_users(competitors)

	return session

# Like and follow instagram users based on hashtags.
def interact_by_tag():

	# Randomize tags and pick first 3
	random.shuffle(hashtags)
	random_hashtags = hashtags[:3]

    # Get a session
	session = get_session()

	# Let's go!
	with smart_run(session):
		try:
			"""Actions"""
			# Like 7-10 posts based on hashtags and like 2-3 posts of its poster (3 hashtags * 10 amount * 3 = 90 post liked)
			session.set_do_follow(enabled=True, percentage=100)
			session.set_user_interact(amount=3, randomize=True, percentage=50, media='Photo')
			session.like_by_tags(random_hashtags, amount=random.randint(7,10), interact=True)

		except Exception:
			print(traceback.format_exc())

# Like and follow instagram users based on location.
def interact_by_location():

	# Randomize locations and pick first 3
	random.shuffle(locations)
	random_locations = locations[:3]

	# Get a session
	session = get_session()

	# Let's go!
	with smart_run(session):
		try:
			"""Actions"""
            # Like 3-5 posts based on location and like 2-3 posts of each poster
			session.set_do_follow(enabled=True, percentage=100)
			session.set_user_interact(amount=random.randint(2,3), randomize=True, percentage=50, media='Photo')
			session.like_by_locations(random_locations, amount=random.randint(3,5), skip_top_posts=False)

		except Exception:
			print(traceback.format_exc())


# Follow competitors followers and like some of their pictures.
def interact_by_competitors_followers():

    # Randomize competitors and pick first 3
	random.shuffle(competitors)
	random_competitors = competitors[:3]

	# Get a session
	session = get_session()

	# Let's go!
	with smart_run(session):
		try:
			"""Actions"""
			# Follow 10-15 followers per competitor account (3) and like 2-3 of their posts (max 45 follows + 45 likes)
			session.set_user_interact(amount=random.randint(2,3), randomize=True, percentage=50, media='Photo')
			session.follow_user_followers(random_competitors, amount=random.randint(10,15), randomize=False, interact=True)

		except Exception:
			print(traceback.format_exc())
	

# Like and follow likers of competitor's posts.
def interact_by_likers_competitors():

    # Randomize competitors and pick first 3
	random.shuffle(competitors)
	random_competitors = competitors[:3]

	# Get a session
	session = get_session()

	# Let's go!
	with smart_run(session):
		try:
			"""Actions"""
			# Grab 2-4 of the newest photos of each of competitors (3), follow 2-4 likers per photo (max 4 * 4 * 3 = 48)
			session.set_user_interact(amount=random.randint(1,2), randomize=True, percentage=70, media='Photo')
			session.follow_likers(random_competitors, photos_grab_amount=random.randint(2,4),
							follow_likers_per_photo=random.randint(2,4), randomize=False, sleep_delay=random.randint(500,600), interact=True)

		except Exception:
			print(traceback.format_exc())


# Like and follow commenters of ompetitor's posts.
def interact_by_commenters_competitors():

    # Randomize competitors and pick first 3
	random.shuffle(competitors)
	random_competitors = competitors[:3]

	# Get a session
	session = get_session()

	# Let's go!
	with smart_run(session):
		try:
			"""Actions"""
			# Analyzes up to each competitor's photos (max_pic) that are (daysold) and follows (amount), also interacts with them
			session.set_user_interact(amount=random.randint(1,2), randomize=True, percentage=70, media='Photo')
			session.follow_commenters(random_competitors, amount=random.randint(20,30), daysold=365,
							max_pic=30, sleep_delay=random.randint(500,600), interact=True)

		except Exception:
			print(traceback.format_exc())


# @todo – implement feature
# Normal unfollowing of previously followed accounts by InstaPy (75 max).
def unfollow():
	# Unfollows 50-75 random users that don't follow me back. Only unfollows them after 72 hours (3 days)
	session.unfollow_users(amount=random.randint(50,75), InstapyFollowed=(True, "nonfollowers"), style="RANDOM",
                    unfollow_after = 72*60*60, sleep_delay=600)


# @todo – implement feature
# Mass unfollowing of previously followed accounts by InstaPy (200 max).
def mass_unfollow():
	# Unfollows 150-200 of all of our users (not random). Only unfollows them after 128 hours (7 days)
	session.unfollow_users(amount=random.randint(150,200), InstapyFollowed=(True, "all"), style="FIFO",
					unfollow_after=128*60*60, sleep_delay=random.randit(500,600))

# Session & features to run
def start_session():
	"""Starts session"""
	# List of available actions
	actions = [interact_by_tag, interact_by_location, interact_by_competitors_followers, interact_by_likers_competitors, interact_by_commenters_competitors]

  # Randomize actions and pick first
	random.shuffle(actions)
	random_action = actions[0]

  # Run function
	random_action()

# Main – Run, wait and restart as long as the bot is running
while True:
    # Run the session
    start_session()
    
    # Wait 10 to 30 minutes
    ten = 60 * 10
    thirty = 60 * 30

    delay = random.randint(ten, thirty)
    time.sleep(30)