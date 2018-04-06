import random
from math import sin, cos, sqrt, atan2, radians
# approximate radius of earth in km
from typing import List


class Point(object):
    R = 6373.0

    def __init__(self, lat: float, lon: float, payload: dict = None):
        self.lat = lat
        self.lon = lon
        self.payload = payload

    @staticmethod
    def distance(left, right):
        lat1 = radians(left.lat)
        lon1 = radians(left.lon)
        lat2 = radians(right.lat)
        lon2 = radians(right.lon)

        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return (Point.R * c) * 1000.0


class Cluster(object):

    def __init__(self, points):
        assert len(points) > 0

        # The points that belong to this cluster
        self.points = points

        # Set up the initial centroid (this is usually based off one point)
        self.centroid = self.calculate_centroid()

    def calculate_centroid(self):
        num_points = len(self.points)
        lat = sum([p.lat for p in self.points]) / float(num_points)
        lon = sum([p.lon for p in self.points]) / float(num_points)
        return Point(lat, lon)

    def update(self, points):
        '''
        Returns the distance between the previous centroid and the new after
        recalculating and storing the new centroid.
        Note: Initially we expect centroids to shift around a lot and then
        gradually settle down.
        '''
        old_centroid = self.centroid
        self.points = points
        if len(self.points) == 0:
            return 0

        self.centroid = self.calculate_centroid()
        return Point.distance(old_centroid, self.centroid)

    def get_total_distance(self):
        '''
        Return the sum of all squared Euclidean distances between each point in
        the cluster and the cluster's centroid.
        '''
        return sum([Point.distance(p, self.centroid) for p in self.points])

    @property
    def max_distance(self):
        return max([Point.distance(p, self.centroid) for p in self.points])


def get_clusters(points: List[dict], max_dist: float) -> List[dict]:
    """
    Finds best possible clustering of points with respect to max distance
    Runs iterative k-means until all elements are in a satisfiable cluster
    :param points: list of points
    :param max_dist: maximal distance of any node from cluster center in meters
    :return: list of clustered points (lists)
    """
    pts = [Point(lat=p['latitude'], lon=p['longitude'], payload=p) for p in points]
    num_clusters = 1

    while True:
        clusters = iterative_kmeans(points=pts, num_clusters=num_clusters, cutoff=1, iteration_count=20)
        k_increase = 0
        for i,c in enumerate(clusters):
            if c.max_distance > max_dist:
                k_increase += 1

        if k_increase == 0:
            break

        num_clusters += k_increase

    return [
        dict(coords=dict(lat=c.centroid.lat, lon=c.centroid.lon),
             points=[p.payload for p in c.points]) for c in clusters
    ]


def kmeans(points, k, cutoff):
    # Pick out k random points to use as our initial centroids
    initial_centroids = random.sample(points, k)

    # Create k clusters using those centroids
    # Note: Cluster takes lists, so we wrap each point in a list here.
    clusters = [Cluster([p]) for p in initial_centroids]

    # Loop through the dataset until the clusters stabilize
    loop_counter = 0
    while True:
        # Create a list of lists to hold the points in each cluster
        lists = [[] for _ in clusters]
        cluster_count = len(clusters)

        # Start counting loops
        loop_counter += 1
        # For every point in the dataset ...
        for p in points:
            # Get the distance between that point and the centroid of the first
            # cluster.
            smallest_distance = Point.distance(p, clusters[0].centroid)

            # Set the cluster this point belongs to
            cluster_index = 0

            # For the remainder of the clusters ...
            for i in range(1, cluster_count):
                # calculate the distance of that point to each other cluster's
                # centroid.
                distance = Point.distance(p, clusters[i].centroid)
                # If it's closer to that cluster's centroid update what we
                # think the smallest distance is
                if distance < smallest_distance:
                    smallest_distance = distance
                    cluster_index = i
            # After finding the cluster the smallest distance away
            # set the point to belong to that cluster
            lists[cluster_index].append(p)

        # Set our biggest_shift to zero for this iteration
        biggest_shift = 0.0

        # For each cluster ...
        for i in range(cluster_count):
            # Calculate how far the centroid moved in this iteration
            shift = clusters[i].update(lists[i])
            # Keep track of the largest move from all cluster centroid updates
            biggest_shift = max(biggest_shift, shift)

        # Remove empty clusters
        clusters = [c for c in clusters if len(c.points) != 0]

        # If the centroids have stopped moving much, say we're done!
        if biggest_shift < cutoff:
            break

    return clusters


def iterative_kmeans(points, num_clusters, cutoff, iteration_count):
    """
    K-means isn't guaranteed to get the best answer the first time. It might
    get stuck in a "local minimum."
    Here we run kmeans() *iteration_count* times to increase the chance of
    getting a good answer.
    Returns the best set of clusters found.
    """
    candidate_clusters = []
    errors = []
    for _ in range(iteration_count):
        clusters = kmeans(points, num_clusters, cutoff)
        error = calculate_error(clusters)
        candidate_clusters.append(clusters)
        errors.append(error)

    lowest_error = min(errors)
    ind_of_lowest_error = errors.index(lowest_error)
    best_clusters = candidate_clusters[ind_of_lowest_error]

    return best_clusters


def calculate_error(clusters):
    '''
    Return the average squared distance between each point and its cluster
    centroid.
    This is also known as the "distortion cost."
    '''
    accumulated_distances = 0
    num_points = 0
    for cluster in clusters:
        num_points += len(cluster.points)
        accumulated_distances += cluster.get_total_distance()

    return accumulated_distances / float(num_points)
